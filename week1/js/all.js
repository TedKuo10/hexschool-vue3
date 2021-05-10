/**
 * 需求：
 * todo: 用戶可以新增產品，新增後會移除 input 的內容
 * todo: 用戶可以針對產品切換啟用狀態
 * todo: 用戶可以刪除單一產品
 * todo: 用戶可以一鍵刪除所有產品
 */


//* Product 資訊
const productTitle = document.querySelector("#title");
const productOriginPrice = document.querySelector("#origin_price");
const productPrice = document.querySelector("#price");

//* behavior
const btnAddProduct = document.querySelector("#addProduct");
const btnClearAll = document.querySelector("#clearAll");
const productList = document.querySelector("#productList"); // 針對 product list 以事件指派的概念來監聽底下發生的事件
const productCount = document.querySelector("#productCount");

let productDatas = [];


//* 上方表單
function renderData(){

}

function addProduct(){
  let productObj = {
    id: Date.now(),
    title: productTitle.value,
    origin_price: productOriginPrice.value,
    price: productPrice.value
  }

  productDatas.push(productObj);

  productTitle.value = '';
  productOriginPrice.value = '';
  productPrice.value = '';
}
