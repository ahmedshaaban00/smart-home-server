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
