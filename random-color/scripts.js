'use strict';

const button = document.getElementById('button'),
  container = document.querySelector('.container'),
  heading = document.querySelector('#color');

const randColor = function () {
  return '#' + (Math.random().toString(16) + '000000').substr(2, 6);
};
const changeColor = function (color) {
  button.style.color = color;
  container.style.backgroundColor = color;
  heading.textContent = color;
};

button.addEventListener('click', function () {
  changeColor(randColor());
});
