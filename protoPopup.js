(function () {
  function search() {
    const searchButton = document.getElementById('input');
    searchButton.addEventListener('click', async function () {
      const keyword = document.getElementById('keyword').value;
      console.log(keyword);
      const result = await getProductDataList(keyword);
      console.log('popup result : ', result);
    });
  }

  document.addEventListener('DOMContentLoaded', search);
})();

(function () {
  function getTagsTest() {
    const hashTags = document.getElementById('getTagsTest');
    hashTags.addEventListener('click', async function () {
      const url = ' https://smartstore.naver.com/main/products/416306646';
      const result = await getHashTag(url);
      console.log('getTagsTest result : ', result);

      const data = document.querySelector('#data');
      data.append(result);
    });
  }

  document.addEventListener('DOMContentLoaded', getTagsTest);
})();
