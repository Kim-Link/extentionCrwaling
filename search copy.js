async function getHashTag(url) {
  let result = [];
  try {
    const data = await fetch(url);
    const response = await data.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, 'text/html');
    const jsonData = doc.getElementsByTagName('script');
    const json = jsonData[1].innerHTML.replace(
      'window.__PRELOADED_STATE__=',
      ''
    );
    const scriptInfo = JSON.parse(json);
    const productHashTag = scriptInfo.product.A.seoInfo.sellerTags;
    productHashTag.forEach((el) => {
      result.push(el.text);
    });
  } catch {
    console.error(`getHashTag error : ${error}`);
  }
  return result;
}

async function getProductDataList(keyword) {
  console.log('search.js >> getProductDataList keyword : ', keyword);
  const url = `https://search.shopping.naver.com/search/all?where=all&frm=NVSCTAB&pagingSize=20&query=${encodeURI(
    keyword
  )}`;

  const data = await fetch(url);
  const response = await data.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(response, 'text/html');

  const jsonData = doc.getElementById('__NEXT_DATA__').innerHTML;
  const json = JSON.parse(jsonData);
  const productsList = json.props.pageProps.initialState.products.list;
  let result;
  try {
    result = await Promise.all(
      productsList.map(async (el) => {
        const productData = {};
        const data = el.item;
        productData.productTitle = data.productTitle;
        const categoryFullPath = [];
        for (let i = 1; i <= data.categoryLevel; i += 1) {
          categoryFullPath.push(data[`category${i}Name`]);
        }
        const category = categoryFullPath.join(' > ');
        productData.category = category;
        productData.mallName = data.mallName;
        productData.property = {};
        productData.property.attributeValue = data.attributeValue;
        productData.property.characterValue = data.characterValue;
        // url
        if (el.item.mallProductUrl) {
          console.log(data.mallProductUrl);
          productData.url = data.mallProductUrl;
          // tags = await getHashTag(data.mallProductUrl);
        } else {
          productData.url = null;
        }
        let tags = null;
        productData.tags = tags;

        return productData;
      })
    );
  } catch (error) {
    console.error(` getProductDataList : ${error}`);
  }

  return result;
}
