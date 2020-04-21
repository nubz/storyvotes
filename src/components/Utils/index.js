import React from 'react';
import Moment from 'moment';

const friendlyDate = (dateString, format) => {
  const formatter = {
    "x": "ddd D MMM YYYY HH:mm",
    "X": "ddd D MMM YYYY"
  };
  format = format || "X";
  const dateMoment = Moment(dateString, format);
  return dateMoment.format(formatter[format]);
};

const tsShortDate = timestamp => {
  const dateMoment = Moment(timestamp, 'x');
  return dateMoment.format("D MMM YYYY");
};

const isOverdue = start => {
  const now = Moment().format('X');
  return Moment(start, 'X').format('X') < now;
};

const timeOverDuration = (t, d) => {
  const now = Moment().format('x');
  const timePassed = Math.ceil((now - t) / 1000);
  const duration = d * 86400;
  const progress = (parseFloat(parseInt(timePassed)/parseInt(duration)) * 100).toFixed(2);
  return {
    start: t,
    progress: progress,
    timePassed: timePassed
  }
};

const progressColour = progress => {

  const gradMap = [
  '#FF0000',
  '#FF1100',
  '#FF2300',
  '#FF3400',
  '#FF4600',
  '#FF5700',
  '#FF6900',
  '#FF7B00',
  '#FF8C00',
  '#FF9E00',
  '#FFAF00',
  '#FFC100',
  '#FFD300',
  '#FFE400',
  '#FFF600',
  '#F7FF00',
  '#E5FF00',
  '#D4FF00',
  '#C2FF00',
  '#B0FF00',
  '#9FFF00',
  '#8DFF00',
  '#7CFF00',
  '#6AFF00',
  '#58FF00',
  '#47FF00',
  '#35FF00',
  '#24FF00',
  '#12FF00',
  '#00FF00'
  ];

  const p = Math.floor(progress);
  const diff = 100 - p;
  const result = Math.floor(diff / 5);

  return gradMap[result]
}


const secondsToDuration = totalSeconds => {
  let str = '', oneDay = 86400, oneHour = 3600, oneMinute = 60,
    days = Math.floor(totalSeconds / oneDay),
    hours = Math.floor((totalSeconds % oneDay) / oneHour),
    minutes = Math.floor((totalSeconds % oneHour) / oneMinute),
    seconds = totalSeconds % oneMinute;

  str += (days > 0) ? days + ' days ' : '';
  str += (hours + days > 0) ? hours + ' hours ' : '';
  str += (minutes + hours + days > 0) ? minutes + ' minutes ' : '';
  str += seconds + ' seconds';

  return str;
};

const isSameDay = (start, days) => {
  const now = Moment();
  const startDay = Moment(start, 'X');
  return now.add(days, 'days').isSame(startDay, 'day')
};

const goldCoins = (howMany, color) => {
  color = color || 'yellow';
  return [...Array(howMany).keys()].map(x =>
    <span key={x + '-' + howMany} name='certificate' className={'star-struck'} color={color} />
  )
};

const shuffle = array => {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

const firebaseToArray = obj => {
  return obj ? Object.keys(obj).map(k => obj[k]) : [];
};

const firebaseToArrayWithKey = obj => {
  return obj ? Object.keys(obj).map(k => { return {...obj[k], id: k}}) : [];
}

export default {
  friendlyDate: friendlyDate,
  goldCoins: goldCoins,
  isOverdue: isOverdue,
  firebaseToArray: firebaseToArray,
  firebaseToArrayWithKey: firebaseToArrayWithKey,
  isSameDay: isSameDay,
  shuffle: shuffle,
  timeOverDuration: timeOverDuration,
  secondsToDuration: secondsToDuration,
  progressColour: progressColour,
  tsShortDate: tsShortDate
}
