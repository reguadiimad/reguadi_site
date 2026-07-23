import React from 'react';
import TypeIt from 'typeit-react';

// Helper functions to wrap typed characters in animated spans
export const wrapChar = (char) =>
  `<span class="fade-char">${char === ' ' ? '&nbsp;' : char}</span>`;

export const wrapChar2 = (char) =>
  `<span class="fade-char2">${char === ' ' ? '&nbsp;' : char}</span>`;

// 1. Header TypeIt ("Meet the ")
export const HeaderTypeIt = ({ onComplete }) => {
  return (
    <TypeIt
      options={{
        lifeLike: true,
        speed: 0,
        html: true,
        cursor: true,
        afterComplete: (instance) => {
          instance.destroy();
          if (onComplete) onComplete();
        },
      }}
      getBeforeInit={(instance) => {
        instance
          .type(wrapChar("m")).pause(210)
          .type(wrapChar("e")).pause(120)
          .delete(1).pause(100)
          .delete(1).pause(160)
          .type(wrapChar("M")).pause(100)
          .type(wrapChar("e")).pause(90)
          .type(wrapChar("e")).pause(80)
          .type(wrapChar("t")).pause(106)
          .type(wrapChar(" ")).pause(133)
          .type(wrapChar("t")).pause(118)
          .type(wrapChar("h")).pause(57)
          .type(wrapChar("e")).pause(85)
          .type(wrapChar(" "));

        return instance;
      }}
    />
  );
};

// 2. Badge TypeIt ("<br/> ")
export const BadgeTypeIt = ({ onComplete }) => {
  return (
    <TypeIt
      options={{
        lifeLike: false,
        speed: 0,
        html: true,
        cursor: true,
        afterComplete: (instance) => {
          instance.destroy();
          if (onComplete) onComplete();
        },
      }}
      getBeforeInit={(instance) => {
        instance
          .pause(49)
          .type(wrapChar2("<")).pause(120)
          .type(wrapChar2("b")).pause(80)
          .type(wrapChar2("r")).pause(150)
          .type(wrapChar2("/")).pause(40)
          .type(wrapChar2(">")).pause(120)
          .type(wrapChar2(" ")).pause(80);

        return instance;
      }}
    />
  );
};

// 3. Name TypeIt ("Reguadi imad ")
export const NameTypeIt = ({ onComplete }) => {
  return (
    <TypeIt
      options={{
        lifeLike: true,
        speed: 0,
        cursor: true,
        html: true,
        afterComplete: (instance) => {
          instance.destroy();
          if (onComplete) onComplete();
        },
      }}
      getBeforeInit={(instance) => {
        instance
          .type(wrapChar("R")).pause(180)
          .type(wrapChar("e")).pause(100)
          .type(wrapChar("g")).pause(80)
          .type(wrapChar("u")).pause(65)
          .type(wrapChar("a")).pause(80)
          .type(wrapChar("d")).pause(60)
          .type(wrapChar("i")).pause(70)
          .type(wrapChar(" ")).pause(80)
          .type(wrapChar("i")).pause(90)
          .type(wrapChar("m")).pause(80)
          .type(wrapChar("a")).pause(90)
          .type(wrapChar("d")).pause(90)
          .type(wrapChar(" ")).pause(90)
          .pause(1000);

        return instance;
      }}
    />
  );
};