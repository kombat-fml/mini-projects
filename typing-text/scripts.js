'use strict';
const input = document.querySelector('.input'),
  text = document.querySelector('.text');

function print() {
  text.textContent = input.value;
}

function debounce(time) {
  return function () {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= time) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => print(), time);
  };
}

input.addEventListener('input', debounce(300));
