const { spawn } = require('child_process');

/**
 * Get headers from a curl request performed on a url.
 * @param {string} url
 * @param {Object} options
 * @param {boolean} options.followRedirects
 * @param {Object} options.basicAuth
 * @param {string} options.basicAuth.username
 * @param {string} options.basicAuth.password
 * @param {number} options.maxTime
 * @returns {Promise<Object>} Promise of HTTP headers as an object.
 */
const getHeaders = (
  url,
  options = {
    followRedirects: false,
    basicAuth: {},
    maxTime: 60,
  },
) => new Promise((resolve, reject) => {
  let headers = '';
  let errors = '';

  const curlOptions = ['-I', '-sS'];

  if (options.followRedirects) {
    curlOptions.push('-L');
  }

  if (options.basicAuth) {
    curlOptions.push('-u', `${options.basicAuth.username}:${options.basicAuth.password}`);
  }

  if (options.maxTime > 0) {
    curlOptions.push('-m', String(options.maxTime));
  }

  curlOptions.push(url);

  const child = spawn('curl', curlOptions);

  child.stdout.on('data', (data) => {
    headers += data;
  });

  child.stderr.on('data', (data) => {
    errors += data;
  });

  child.on('exit', (code) => {
    if (code === 0) {
      const response = headers.split('\r\n').reverse();
      const httpIndex = response.findIndex((key) => key.startsWith('HTTP/'));

      const headersObj = response
        .slice(2, httpIndex + 1)
        .reverse()
        .map((k) => k.split(':'))
        .map((arr, index) => {
          if (index === 0) {
            return { status: arr[0].trim().split(' ')[1] };
          }

          return { [arr[0].toLowerCase()]: arr.slice(1).join(':') };
        })
        .reduce((acc, cur) => ({
          ...acc,
          ...cur,
        }), {});

      resolve(headersObj);
    } else {
      reject(new Error(`${errors.toString()} : ${url}`));
    }
  });
});

module.exports = {
  getHeaders,
};
