/* eslint-env browser */

'use strict';

if (process.env.NODE_ENV === 'development') {
  // development mode should be fun!
  var container = document.querySelector('.container');

  var h2 = document.createElement('h2');
  h2.textContent = 'Development Mode!';
  container.appendChild(h2);

  // A Doge deserves a gentleman's position!
  var div = document.createElement('div');
  div.style.margin = '0 auto';
  div.style.width = '500px';
  div.classList.add('thumbnail');
  container.appendChild(div);

  var img = document.createElement('img');
  /* eslint-disable max-len */
  img.src = 'https://dl.dropboxusercontent.com/u/12519690/shared/2016-01-17_proxrox-doge-pic/doge.jpg';
  /* eslint-enable max-len */
  div.appendChild(img);
}

document.getElementById('send-request')
  .addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/get/me/some/data');
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log(xhr.response);
        var output = JSON.stringify(xhr.response, 0, 2);
        document.getElementById('response').textContent = output;
      }
    };
    xhr.send();
  }, false);
