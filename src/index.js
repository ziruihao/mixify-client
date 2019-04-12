import $ from 'jquery';
let num = 0;
setInterval(
    () => {
        $('#main').html(`You've been on this page for ${num} seconds!`);
        num++;
    },
    1000
);
