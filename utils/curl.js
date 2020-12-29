const { spawn } = require('child_process');

const getHeaders = (url) => new Promise((resolve, reject) => {
  let headers = '';

  const child = spawn('curl', ['-Is', url]);

  child.stdout.on('data', (data) => {
    headers += data;
  });

  child.on('exit', (code) => {
    if (code === 0) {
      const headersObj = headers
        .split('\r\n')
        .filter((k) => k)
        .map((k) => k.split(':'))
        .map((arr, index) => {
          if (index === 0) {
            return { status: arr[0].trim().split(' ')[1] };
          }

          return { [arr[0].toLowerCase()]: arr.slice(1).join('') };
        })
        .reduce((acc, cur) => ({
          ...acc,
          ...cur,
        }), {});

      resolve(headersObj);
    } else {
      reject(new Error(`Could not resolve host: ${url}`));
    }
  });
});

module.exports = {
  getHeaders,
};
