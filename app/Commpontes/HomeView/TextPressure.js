import React, { useEffect, useRef } from 'react';
import { useResolvedTheme } from '../../redux/useResolvedTheme';

const TextPressure = ({
  text = 'RegUadi ImAd',
  fontFamily = 'Monologue',
  fontUrl = '',
  textColor,
  className = '',
  
  // Font scale controls
  fontSizeMultiplier = 2.3,
  
  // Custom physics & liquify controls
  influenceRadius = 220,
  stiffness = 0.08,
  damping = 0.82,
  pushStrength = 35,
  twirlStrength = 13,
  rgbSplitIntensity = 0.4,

  // Scroll depth control
  scrollDepthStrength = 1.0
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const isDarkMode = useResolvedTheme();

  const mouseRef = useRef({ x: -2000, y: -2000, targetX: -2000, targetY: -2000 });
  const isHoveringRef = useRef(false);
  const twirlRampRef = useRef(0);

  // Scroll tracking ref
  const scrollRef = useRef({
    y: typeof window !== 'undefined' ? window.scrollY : 0,
    vel: 0,
    targetVel: 0
  });

  // User activity & timing refs
  const lastActivityTimeRef = useRef(performance.now());
  const lastSwapTimeRef = useRef(performance.now());

  const activeTextColor = textColor || (isDarkMode ? '#FFFFFF' : '#000000');

  const parseColor = (colorStr) => {
    if (colorStr.startsWith('#')) {
      let c = colorStr.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      const num = parseInt(c, 16);
      return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
    }
    return [1.0, 1.0, 1.0];
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    if (fontUrl) {
      const linkId = 'text-pressure-font-link';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = fontUrl;
        document.head.appendChild(link);
      }
    }

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: false });
    if (!gl) return;

    // --- WebGL Shaders with Dynamic 3D Scroll Depth ---
    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      attribute vec2 a_offset;

      uniform vec2 u_resolution;
      uniform float u_scrollDepth;

      varying vec2 v_texCoord;
      varying vec2 v_offset;

      void main() {
        vec2 pos = a_position + a_offset;

        // 3D Depth bending distortion on scroll
        vec2 center = u_resolution * 0.5;
        vec2 normPos = (pos - center) / center; // Normalized -1.0 to 1.0
        
        // Parabolic depth factor: center bulges / recesses more than edges
        float distFactor = 1.0 - dot(normPos, normPos) * 0.45;
        float depthScale = 1.0 + (distFactor * u_scrollDepth * 0.18);
        
        vec2 depthPos = center + (pos - center) * depthScale;

        vec2 zeroToOne = depthPos / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
        v_texCoord = a_texCoord;
        v_offset = a_offset;
      }
    `;

    const fsSource = `
      precision mediump float;

      uniform sampler2D u_image;
      uniform vec3 u_textColor;
      uniform float u_rgbSplitIntensity;
      uniform float u_isDarkMode;

      varying vec2 v_texCoord;
      varying vec2 v_offset;

      // Dark mode palette
      const vec3 COLOR_BLUE       = vec3(0.1921, 0.4745, 1.0000); // #3179FF
      const vec3 COLOR_ORANGE     = vec3(0.9647, 0.3490, 0.0000); // #F65900
      const vec3 COLOR_GREEN      = vec3(0.2549, 0.8510, 0.3490); // #41D959

      // Light mode palette (Blue shades & Soft White)
      const vec3 COLOR_ROYAL_BLUE = vec3(0.1176, 0.3882, 0.9412); // #1E63F0
      const vec3 COLOR_DEEP_BLUE  = vec3(0.0392, 0.1804, 0.5412); // #0A2E8A
      const vec3 COLOR_SOFT_WHITE = vec3(0.9216, 0.9412, 0.9804); // #EBF0FA

      void main() {
        float warpLen = length(v_offset);
        vec2 baseShift = v_offset * 0.00065 * u_rgbSplitIntensity;

        vec2 shift1, shift2, shift3;
        vec3 col1, col2, col3;
        float w1, w2, w3;

        if (u_isDarkMode > 0.5) {
          shift1 = baseShift * 1.8;
          shift2 = vec2(0.0);
          shift3 = -baseShift * 0.7;

          col1 = COLOR_ORANGE;
          col2 = COLOR_GREEN;
          col3 = COLOR_BLUE;

          w1 = 1.7;
          w2 = 0.85;
          w3 = 0.5;
        } else {
          shift1 = baseShift * 1.9;
          shift2 = baseShift * 0.8;
          shift3 = -baseShift * 1.2;

          col1 = COLOR_ROYAL_BLUE;
          col2 = COLOR_DEEP_BLUE;
          col3 = COLOR_SOFT_WHITE;

          w1 = 1.8;
          w2 = 1.2;
          w3 = 1.4;
        }

        float a1 = texture2D(u_image, v_texCoord + shift1).a;
        float a2 = texture2D(u_image, v_texCoord + shift2).a;
        float a3 = texture2D(u_image, v_texCoord + shift3).a;

        float maxAlpha = max(a1, max(a2, a3));
        if (maxAlpha < 0.002) {
          discard;
        }

        vec3 c1 = col1 * a1 * w1;
        vec3 c2 = col2 * a2 * w2;
        vec3 c3 = col3 * a3 * w3;

        vec3 chromatic = (c1 + c2 + c3) / max(a1 + a2 + a3, 0.001);
        vec3 baseColor = u_textColor * a2;

        float mixFactor = clamp(warpLen * 0.045 * u_rgbSplitIntensity, 0.0, 1.0);
        vec3 finalRGB = mix(baseColor, chromatic, mixFactor);

        gl_FragColor = vec4(finalRGB, maxAlpha);
      }
    `;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    const aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
    const aOffset = gl.getAttribLocation(program, 'a_offset');

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTextColor = gl.getUniformLocation(program, 'u_textColor');
    const uRgbSplit = gl.getUniformLocation(program, 'u_rgbSplitIntensity');
    const uIsDarkMode = gl.getUniformLocation(program, 'u_isDarkMode');
    const uScrollDepth = gl.getUniformLocation(program, 'u_scrollDepth');

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const COLS = 140;
    const ROWS = 60;
    const NUM_NODES = (COLS + 1) * (ROWS + 1);

    const restPos = new Float32Array(NUM_NODES * 2);
    const currPos = new Float32Array(NUM_NODES * 2);
    const vel = new Float32Array(NUM_NODES * 2);
    const texCoords = new Float32Array(NUM_NODES * 2);
    const offsets = new Float32Array(NUM_NODES * 2);
    const indices = new Uint16Array(COLS * ROWS * 6);

    const posBuffer = gl.createBuffer();
    const texBuffer = gl.createBuffer();
    const offsetBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    let width = 0;
    let height = 0;
    let dpr = 1;

    // --- Per-Letter Casing Logic & Dynamic Layout ---
    const baseChars = text.split('');
    
    const charStates = baseChars.map(char => {
      const isR = char.toLowerCase() === 'r';
      const isInitialUpper = isR || (char === char.toUpperCase() && /[a-zA-Z]/.test(char));
      return {
        char,
        isR,
        current: isInitialUpper ? 1.0 : 0.0,
        target: isInitialUpper ? 1.0 : 0.0,
        x: 0
      };
    });

    const pickNextTargets = () => {
      const candidates = [];
      charStates.forEach((st, idx) => {
        if (!st.isR && /[a-zA-Z]/.test(st.char)) {
          candidates.push(idx);
        }
      });

      const targetTotalUpper = Math.floor(Math.random() * 3) + 3;
      const numAdditional = Math.min(targetTotalUpper - 1, candidates.length);

      const shuffled = [...candidates].sort(() => Math.random() - 0.5);
      const chosenIndices = new Set(shuffled.slice(0, numAdditional));

      charStates.forEach((st, idx) => {
        if (st.isR) {
          st.target = 1.0;
        } else if (chosenIndices.has(idx)) {
          st.target = 1.0;
        } else {
          st.target = 0.0;
        }
      });
    };

    const triggerLetterPhysicsImpulse = (xPos, yPos, magnitude) => {
      for (let i = 0; i < NUM_NODES * 2; i += 2) {
        const dx = restPos[i] - xPos;
        const dy = restPos[i + 1] - yPos;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 0.001) {
          const factor = (1.0 - dist / 130);
          vel[i] += (dx / dist) * factor * magnitude;
          vel[i + 1] += (dy / dist) * factor * magnitude;
        }
      }
    };

    const updateAndDrawLetters = () => {
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.save();
      offCtx.scale(dpr, dpr);

      let baseFontSize = width / (text.length * 0.60);
      let fontSize = baseFontSize * fontSizeMultiplier;
      fontSize = Math.min(fontSize, height * 0.85);

      offCtx.font = `900 ${fontSize}px "${fontFamily}", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = activeTextColor;

      let totalWidth = 0;
      const charMetrics = charStates.map(st => {
        if (st.char === ' ') {
          const spaceW = offCtx.measureText(' ').width;
          totalWidth += spaceW;
          return { wLower: spaceW, wUpper: spaceW, currentW: spaceW };
        }

        const lowerChar = st.char.toLowerCase();
        const upperChar = st.char.toUpperCase();

        const wLower = offCtx.measureText(lowerChar).width;
        const wUpper = offCtx.measureText(upperChar).width;
        
        const currentW = wLower + (wUpper - wLower) * st.current;
        totalWidth += currentW;

        return { wLower, wUpper, currentW };
      });

      let currX = (width - totalWidth) / 2;

      charStates.forEach((st, i) => {
        const { currentW } = charMetrics[i];
        const charCenterX = currX + currentW / 2;
        st.x = charCenterX;

        if (st.char !== ' ') {
          const v = st.current;
          const lowerChar = st.char.toLowerCase();
          const upperChar = st.char.toUpperCase();

          offCtx.save();
          offCtx.translate(charCenterX, height / 2);

          const transitionWave = Math.sin(v * Math.PI);
          const scaleX = 1.0 + transitionWave * 0.12;
          const scaleY = 1.0 - transitionWave * 0.08;
          offCtx.scale(scaleX, scaleY);

          if (v <= 0.01) {
            offCtx.fillText(lowerChar, 0, 0);
          } else if (v >= 0.99) {
            offCtx.fillText(upperChar, 0, 0);
          } else {
            if (transitionWave > 0.1) {
              offCtx.filter = `blur(${transitionWave * 2.5}px)`;
            }

            offCtx.save();
            offCtx.globalAlpha = Math.cos((v * Math.PI) / 2);
            offCtx.scale(1.0 - v * 0.15, 1.0 - v * 0.15);
            offCtx.fillText(lowerChar, 0, 0);
            offCtx.restore();

            offCtx.save();
            offCtx.globalAlpha = Math.sin((v * Math.PI) / 2);
            offCtx.scale(0.85 + v * 0.15, 0.85 + v * 0.15);
            offCtx.fillText(upperChar, 0, 0);
            offCtx.restore();
          }

          offCtx.restore();
        }

        currX += currentW;
      });

      offCtx.restore();

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offCanvas);
    };

    const buildGrid = (w, h) => {
      width = w;
      height = h;

      dpr = Math.max(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);

      offCanvas.width = w * dpr;
      offCanvas.height = h * dpr;

      updateAndDrawLetters();

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const idx = (r * (COLS + 1) + c) * 2;
          const x = (c / COLS) * w;
          const y = (r / ROWS) * h;

          restPos[idx] = x;
          restPos[idx + 1] = y;

          currPos[idx] = x;
          currPos[idx + 1] = y;

          vel[idx] = 0;
          vel[idx + 1] = 0;

          texCoords[idx] = c / COLS;
          texCoords[idx + 1] = r / ROWS;

          offsets[idx] = 0;
          offsets[idx + 1] = 0;
        }
      }

      let idx = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const n0 = r * (COLS + 1) + c;
          const n1 = n0 + 1;
          const n2 = (r + 1) * (COLS + 1) + c;
          const n3 = n2 + 1;

          indices[idx++] = n0;
          indices[idx++] = n2;
          indices[idx++] = n1;

          indices[idx++] = n1;
          indices[idx++] = n2;
          indices[idx++] = n3;
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, restPos, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        buildGrid(rect.width, rect.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (document.fonts) {
      document.fonts.ready.then(handleResize);
      document.fonts.load(`900 48px "${fontFamily}"`).then(handleResize);
    }

    const recordUserActivity = () => {
      lastActivityTimeRef.current = performance.now();
    };

    // --- Scroll Event Tracking ---
    const onScroll = () => {
      recordUserActivity();
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - scrollRef.current.y;
      scrollRef.current.targetVel += deltaY;
      scrollRef.current.y = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const updateTargetMouse = (clientX, clientY) => {
      recordUserActivity();
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = clientX - rect.left;
      mouseRef.current.targetY = clientY - rect.top;
    };

    const onMouseMove = (e) => {
      updateTargetMouse(e.clientX, e.clientY);
      if (!isHoveringRef.current) {
        const rect = container.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
      }
      isHoveringRef.current = true;
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        updateTargetMouse(e.touches[0].clientX, e.touches[0].clientY);
        isHoveringRef.current = true;
      }
    };

    const onMouseLeave = () => {
      recordUserActivity();
      isHoveringRef.current = false;
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchend', onMouseLeave);

    window.addEventListener('keydown', recordUserActivity);
    window.addEventListener('mousedown', recordUserActivity);
    window.addEventListener('touchstart', recordUserActivity, { passive: true });

    let rafId;
    const stride = (COLS + 1) * 2;
    const IDLE_SWAP_INTERVAL = 15000;

    const render = () => {
      const now = performance.now();
      const timeSinceActivity = now - lastActivityTimeRef.current;
      const timeSinceLastSwap = now - lastSwapTimeRef.current;

      if (timeSinceActivity > 2000) {
        if (timeSinceLastSwap >= IDLE_SWAP_INTERVAL) {
          lastSwapTimeRef.current = now;
          pickNextTargets();
        }
      } else {
        lastSwapTimeRef.current = now;
      }

      charStates.forEach(st => {
        const delta = st.target - st.current;
        if (Math.abs(delta) > 0.001) {
          st.current += delta * 0.045;

          if (Math.abs(delta) > 0.1 && Math.random() < 0.2) {
            triggerLetterPhysicsImpulse(st.x, height / 2, delta > 0 ? 8 : -6);
          }
        } else {
          st.current = st.target;
        }
      });

      updateAndDrawLetters();

      // --- Smooth Scroll Physics Computation ---
      scrollRef.current.vel += (scrollRef.current.targetVel - scrollRef.current.vel) * 0.12;
      scrollRef.current.targetVel *= 0.82; // Velocity damping
      
      const currentScrollVel = scrollRef.current.vel;
      const scrollImpulse = Math.min(Math.max(currentScrollVel * 0.18, -45), 45) * scrollDepthStrength;

      const mouse = mouseRef.current;

      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      const mvx = mouse.targetX - mouse.x;
      const mvy = mouse.targetY - mouse.y;

      if (isHoveringRef.current) {
        twirlRampRef.current = Math.min(1.0, twirlRampRef.current + 0.04);
      } else {
        twirlRampRef.current = Math.max(0.0, twirlRampRef.current - 0.03);
      }

      const activeTwirl = twirlStrength * twirlRampRef.current;
      const radius = influenceRadius;

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const idx = (r * (COLS + 1) + c) * 2;
          const rx = restPos[idx];
          const ry = restPos[idx + 1];

          let cx = currPos[idx];
          let cy = currPos[idx + 1];

          let vx = vel[idx];
          let vy = vel[idx + 1];

          let ox = cx - rx;
          let oy = cy - ry;

          let sumNox = 0;
          let sumNoy = 0;
          let neighborCount = 0;

          if (c > 0) { sumNox += offsets[idx - 2]; sumNoy += offsets[idx - 1]; neighborCount++; }
          if (c < COLS) { sumNox += offsets[idx + 2]; sumNoy += offsets[idx + 1]; neighborCount++; }
          if (r > 0) { sumNox += offsets[idx - stride]; sumNoy += offsets[idx - stride + 1]; neighborCount++; }
          if (r < ROWS) { sumNox += offsets[idx + stride]; sumNoy += offsets[idx + stride + 1]; neighborCount++; }

          const cohesX = ((sumNox / neighborCount) - ox) * 0.22;
          const cohesY = ((sumNoy / neighborCount) - oy) * 0.22;

          let accelX = cohesX;
          let accelY = cohesY;

          // Add scroll depth fluid force across the mesh
          if (Math.abs(scrollImpulse) > 0.01) {
            const normX = (rx - width * 0.5) / (width * 0.5);
            const archFactor = 1.0 - normX * normX * 0.6; // Parabolic curve
            accelY += scrollImpulse * archFactor * 0.06;
          }

          const dx = mouse.x - rx;
          const dy = mouse.y - ry;
          const dist = Math.hypot(dx, dy);

          if (dist < radius && dist > 0.001) {
            const normDist = dist / radius;
            const factor = (1.0 - normDist * normDist) * (1.0 - normDist);

            const dirX = dx / dist;
            const dirY = dy / dist;

            const pushX = -dirX * factor * pushStrength;
            const pushY = -dirY * factor * pushStrength;

            const twirlX = -dirY * factor * activeTwirl;
            const twirlY = dirX * factor * activeTwirl;

            const dragX = mvx * factor * 0.35;
            const dragY = mvy * factor * 0.35;

            accelX += (pushX + twirlX + dragX) * 0.12;
            accelY += (pushY + twirlY + dragY) * 0.12;
          }

          const springX = -ox * stiffness;
          const springY = -oy * stiffness;

          accelX += springX;
          accelY += springY;

          vx = (vx + accelX) * damping;
          vy = (vy + accelY) * damping;

          cx += vx;
          cy += vy;

          currPos[idx] = cx;
          currPos[idx + 1] = cy;

          vel[idx] = vx;
          vel[idx + 1] = vy;

          offsets[idx] = cx - rx;
          offsets[idx + 1] = cy - ry;
        }
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform2f(uResolution, width, height);
      const rgb = parseColor(activeTextColor);
      gl.uniform3f(uTextColor, rgb[0], rgb[1], rgb[2]);

      // Boost Chromatic Aberration dynamically when scrolling fast
      const dynamicRgbSplit = rgbSplitIntensity + Math.min(Math.abs(currentScrollVel) * 0.012, 1.2) * scrollDepthStrength;
      gl.uniform1f(uRgbSplit, dynamicRgbSplit);

      gl.uniform1f(uIsDarkMode, isDarkMode ? 1.0 : 0.0);

      // Pass scroll depth perspective amount to vertex shader
      const depthUniformValue = Math.min(Math.max(currentScrollVel * 0.022 * scrollDepthStrength, -1.8), 1.8);
      gl.uniform1f(uScrollDepth, depthUniformValue);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
      gl.enableVertexAttribArray(aTexCoord);
      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aOffset);
      gl.vertexAttribPointer(aOffset, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      
      if (container) {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('mouseleave', onMouseLeave);
        container.removeEventListener('touchend', onMouseLeave);
      }

      window.removeEventListener('keydown', recordUserActivity);
      window.removeEventListener('mousedown', recordUserActivity);
      window.removeEventListener('touchstart', recordUserActivity);
    };
  }, [
    text,
    fontFamily,
    fontUrl,
    activeTextColor,
    isDarkMode,
    fontSizeMultiplier,
    influenceRadius,
    stiffness,
    damping,
    pushStrength,
    twirlStrength,
    rgbSplitIntensity,
    scrollDepthStrength
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[450px] flex items-center justify-center overflow-hidden cursor-pointer select-none bg-transparent ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-auto"
      />
    </div>
  );
};

export default TextPressure;
