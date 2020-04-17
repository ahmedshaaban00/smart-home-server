import colors from 'colors';

export const promiseWithTimeout = (
  promise = new Promise(() => {}),
  expiryTime = 3000
) => {
  let timer;
  const timerPromise = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error()), expiryTime);
  });

  return Promise.race([promise(), timerPromise]).then((result) => {
    clearTimeout(timer);
    return result;
  });
};

// Handling Logs: message(string), type(SUCCESS, ERROR)
export const log = (message, type, name) => {
  let color;
  switch (type) {
    case 'SUCCESS':
      color = 'green';
      break;
    case 'ERROR':
      color = 'red';
      break;
    default:
      color = 'white';
  }

  console.log(`${colors.bold.magenta(name)}: ${colors[color](message)}`);
};
