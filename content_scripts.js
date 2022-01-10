const searchButton = document.getElementById('search');
const getTagsButton = document.getElementById('getTagsTest');
const dataList = document.getElementById('dataList');

let searchData = [];
let tagData = [];

const dataListReducer = function (ul, searchData, tagData) {
  const li = document.createElement('li');
  li.classList.add('searchData');

  const productTitle = document.createElement('div');
  const category = document.createElement('div');
  const mallName = document.createElement('div');
  const attributeValue = document.createElement('div');
  const characterValue = document.createElement('div');
  const tags = document.createElement('div');

  productTitle.classList.add('productTitle');
  category.classList.add('category');
  mallName.classList.add('mallName');
  attributeValue.classList.add('attributeValue');
  characterValue.classList.add('characterValue');
  tags.classList.add('tags');

  productTitle.textContent = searchData.productTitle;
  category.textContent = searchData.category;
  mallName.textContent = searchData.mallName;
  attributeValue.textContent = searchData.property.attributeValue;
  characterValue.textContent = searchData.property.characterValue;
  tags.textContent = tagData.tags;

  li.append(
    productTitle,
    category,
    mallName,
    attributeValue,
    characterValue,
    tags
  );
  ul.append(li);
  return ul;
};

const renderData = function () {
  const ul = document.createElement('ul');
  ul.id = 'dataList';
  const data = searchData.reduce(dataListReducer, ul);
  dataList.append(data);
};

const removeData = function () {
  console.log('check : removeData');
  const dataList = document.querySelector('#dataList');
  dataList.remove();
};

// 하...씨 모르겟노...
searchButton.addEventListener('click', async function () {
  const keyword = document.getElementById('keyword').value;
  console.log('popup.js >> addEventListener >> keyword : ', keyword);
  searchData = await getProductDataList(keyword);
  console.log('popup FRIST result : ', searchData);
  renderData();
  tagData = await inputTags(searchData);
  console.log('tagData result : ', tagData);
  console.log('popup SECOND result : ', searchData);
});

getTagsButton.addEventListener('click', async function () {
  const url = ' https://smartstore.naver.com/main/products/416306646';
  const result = await getHashTag(url);
  console.log('getTagsTest result : ', result);

  const tags = document.querySelector('#tag');
  tags.append(result);
});

console.log('popup.js >> first searchData : ', searchData);
renderData();
