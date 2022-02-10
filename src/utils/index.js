export const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])];
  };
  
 export const getDayOfYearKey = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff/oneDay);
    const year = new Date().getUTCFullYear();
    return `${day}${year}`;
  };

  export const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff/oneDay);
    return day;
  };

  export const setLetters = () => {
    const twelveCommon = [ 'r', 't', 'n', 'l', 'c', 'd', 'p', 'm', 'h', 'g', 'f', 'k'];
    const nextNine = ['b', 'y', 'w', 'v', 'x', 'j', 'q', 'z'];
    const vowels = ['a', 'i', 'o', 'u'];
    const theEleven = [];
    for (let i = 0; i<2; i++){
      var thisRun = Math.floor(Math.random() * 4)
      if (theEleven.includes(vowels[thisRun])) {
        i = i-1;
      } else {
      theEleven.push(vowels[thisRun])
      }
    }
    theEleven.push('e');
    for (let i = 0; i<4; i++){
      var thisRun = Math.floor(Math.random() * 12)
      if (theEleven.includes(twelveCommon[thisRun])) {
        i = i-1;
      } else {
      theEleven.push(twelveCommon[thisRun])
      }
    }
    for (let i = 0; i<2; i++){
      var thisRun = Math.floor(Math.random() * 9)
      if (theEleven.includes(nextNine[thisRun])) {
        i = i-1;
      } else {
      theEleven.push(nextNine[thisRun])
      }
    }
    theEleven.push('s');
    return theEleven;
  }
