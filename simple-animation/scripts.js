'use strict';
const start = document.querySelector('.start'),
  reset = document.querySelector('.reset'),
  line = document.querySelector('.line');

let animation = null,
  corner = 0,
  speed = 4;

const animate = () => {
  corner += speed;
  corner %= 360;
  line.style.transform = `rotate(${corner}deg)`;
  animation = requestAnimationFrame(animate);
};

const startAndStop = () => {
  if (start.textContent === 'Старт') {
    start.textContent = 'Стоп';
    animation = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animation);
    start.textContent = 'Старт';
  }
};

const resetAnimation = () => {
  if (animation) {
    cancelAnimationFrame(animation);
    corner = 0;
    start.textContent = 'Старт';
    line.style.transform = '';
  }
};

start.addEventListener('click', startAndStop);
reset.addEventListener('click', resetAnimation);
