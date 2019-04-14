import './style.scss';
import $ from 'jquery';

let sec = 0;
setInterval(
  () => {
    if (sec >= 60) {
      const min = Math.floor(sec / 60);
      $('#main').html(`You've been on this page for ${min} minutes and ${sec % 60} seconds!`);
    } else {
      $('#main').html(`You've been on this page for ${sec} seconds!`);
    }
    sec += 1;
  },
  1000,
);
