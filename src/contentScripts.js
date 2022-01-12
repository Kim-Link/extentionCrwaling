function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getHashTag(url) {
  let result = [];
  if (!url.includes('/smartstore.naver.com')) return result;
  try {
    const data = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: 'getHashTag',
          payload: { url },
        },
        (response) => {
          resolve(response);
        }
      );
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const jsonData = doc.getElementsByTagName('script');
    const json = jsonData[1].innerHTML.replace(
      'window.__PRELOADED_STATE__=',
      ''
    );
    const scriptInfo = JSON.parse(json);
    const productHashTag = scriptInfo.product.A.seoInfo.sellerTags;
    if (productHashTag) {
      productHashTag.forEach((el) => {
        result.push(el.text);
      });
    }
  } catch (error) {
    console.error(`getHashTag error : ${error}`);
  }
  return result;
}

async function getProductDataList(keyword) {
  console.log('search.js >> getProductDataList keyword : ', keyword);
  const url = `https://search.shopping.naver.com/search/all?where=all&frm=NVSCTAB&pagingSize=40&query=${encodeURI(
    keyword
  )}`;

  const data = await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: 'getProductDataList',
        payload: { url },
      },
      (response) => {
        resolve(response);
      }
    );
  });
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');

  const jsonData = doc.getElementById('__NEXT_DATA__').innerHTML;
  const json = JSON.parse(jsonData);
  const productsList = json.props.pageProps.initialState.products.list;
  let result;
  try {
    result = [];
    productsList.forEach((el) => {
      if (!el.item.adId) {
        const productData = {};
        const data = el.item;
        const categoryFullPath = [];
        for (let i = 1; i <= data.categoryLevel; i += 1) {
          categoryFullPath.push(data[`category${i}Name`]);
        }
        const category = categoryFullPath.join(' > ');
        productData.productTitle = data.productTitle;
        productData.category = category;
        productData.mallName = data.mallName;
        productData.property = {};
        productData.property.attributeValue = data.attributeValue;
        productData.property.characterValue = data.characterValue;
        productData.id = data.id;
        if (el.item.mallProductUrl) {
          productData.url = data.mallProductUrl;
        } else {
          productData.url = null;
        }
        result.push(productData);
      }
    });
    return result;
  } catch (error) {
    console.error(` getProductDataList : ${error}`);
  }
  console.log('getProductDataList : ', result);
  return result;
}

async function inputTags(data) {
  const tagsData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].url) {
      const id = data[i].id;
      const tag = await getHashTag(data[i].url);
      data[i].tags = tag;
      tagsData.push({ id, tag });
    }
  }
  // 스트링으로 바꿔서 로컬스토리지에 넣어주기.
  // localStorage.setItem(tagsData);
  return tagsData;
}

function search() {
  const tab = document.getElementById('rc-tabs-1-tab-3');

  tab.addEventListener('click', async function () {
    sleep(10).then(() => {
      console.log('hi 10');
      const searchButton = document.getElementById('search');
      searchButton.addEventListener('click', async function () {
        const keyword = document.getElementById('keyword').value;
        console.log(keyword);
        let productDataList = await getProductDataList(keyword);
        localStorage.setItem(
          'productnameData',
          JSON.stringify(productDataList)
        );
        console.log('search >>>>> productDataList', productDataList);
        let hashTags = await inputTags(productDataList);
        localStorage.setItem('hashTags', JSON.stringify(hashTags));
        console.log('search >>>>> hashTags', hashTags);
      });
    });
  });
}
window.onload = search;
