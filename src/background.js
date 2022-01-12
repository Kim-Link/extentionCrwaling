'use strict';

async function getUrlData(url) {
  const data = await fetch(url).then((response) => {
    if (response.headers.server === 'nginx') throw Error; // 429 에러
    return response.text();
  });
  return data;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getHashTag') {
    (async () => {
      const result = await getUrlData(request.payload.url);
      sendResponse(result);
    })();

    return true;
  }
  if (request.type === 'getProductDataList') {
    (async () => {
      const result = await getUrlData(request.payload.url);
      sendResponse(result);
    })();
    console.log('this is background haha.');
    return true;
  }
});
