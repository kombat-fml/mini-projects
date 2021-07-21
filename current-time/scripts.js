'use strict';

const week = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  month = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
  ],
  time1 = document.querySelector('.time1'),
  time2 = document.querySelector('.time2');

const endingWord = function (n, gender) {
  let string;
  switch (true) {
    case n <= 14 && n >= 11:
      string = gender === 'hours' ? 'ов' : '';
      break;
    case n % 10 === 1:
      string = gender === 'hours' ? '' : 'а';
      break;
    case n % 10 >= 2 && n % 10 <= 4:
      string = gender === 'hours' ? 'а' : 'ы';
      break;
    default:
      string = gender === 'hours' ? 'ов' : '';
  }
  return string;
};
const formatNumber = function (n) {
  return Math.floor(n / 10) === 0 ? '0' + n : n;
};

const prepareStrings = function () {
  const date = new Date();
  time1.textContent = `Сегодня ${week[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]},
  ${date.getHours()} час${endingWord(date.getHours(), 'hours')}
  ${date.getMinutes()} минут${endingWord(date.getMinutes(), 'min')}
  ${date.getSeconds()} секунд${endingWord(date.getSeconds(), 'seconds')}`;

  time2.textContent = `${formatNumber(date.getDate())}.${formatNumber(date.getMonth())}.${date.getFullYear()} -
  ${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}:${formatNumber(date.getSeconds())}`;
};

setInterval(prepareStrings, 1000);
