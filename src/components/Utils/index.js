const firebaseToArray = obj => {
  return obj ? Object.keys(obj).map(k => obj[k]) : [];
};

const firebaseToArrayWithKey = obj => {
  return obj ? Object.keys(obj).map(k => { return {...obj[k], id: k}}) : [];
}

const storeObj = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
}

const getObj = key => {
  const retrievedObject = localStorage.getItem(key);
  return JSON.parse(retrievedObject)
}

const decks = {
  Days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  Fibonacci: [1, 2, 3, 5, 8, 13, 21, 34, 55],
  'T-Shirt': ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
  YesNo: ['Yes', 'No']
}

export default {
  decks: decks,
  firebaseToArray: firebaseToArray,
  firebaseToArrayWithKey: firebaseToArrayWithKey,
  storeObj: storeObj,
  getObj: getObj
}
