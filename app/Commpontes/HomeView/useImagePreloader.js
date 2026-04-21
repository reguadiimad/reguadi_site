// hooks/useImagePreloader.js
import { useEffect, useState } from 'react';

export default function useImagePreloader(urls) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const total = urls.length;

    Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = img.onerror = () => {
              loaded++;
              if (!cancelled) setProgress(loaded / total);
              // decode() forces the browser to rasterize NOW, not on first paint
              (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).finally(resolve);
            };
            img.src = src;
          })
      )
    ).then(() => !cancelled && setReady(true));

    return () => { cancelled = true; };
  }, [urls.join('|')]); // eslint-disable-line

  return { ready, progress };
}