/**
 * 需求：
 * todo: 用戶可以新增產品，新增後會移除 input 的內容
 * todo: 用戶可以一鍵刪除所有產品
 * todo: 用戶可以針對產品切換啟用狀態
 * todo: 用戶可以刪除單一產品
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

let productData = [{
  id: Date.now(),
  title: "TEST",
  origin_price: 2,
  price: 2,
  is_enable: false
}];


function renderData(){
  let str = '';
  // 當 productData 數量為 0 時，不會跑 forEach
  productData.forEach(function(item, index){
    console.log(index);
    str += `<tr>
      <td>${item.title}</td>
      <td width="120">
        ${item.origin_price}
      </td>
      <td width="120">
      ${item.price}
      </td>
      <td width="100">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="${item.id}" data-action="status" data-id="${item.id}">
          <label class="form-check-label" for="${item.id}">未啟用</label>
        </div>
      </td>
      <td width="120">
        <button type="button" class="btn btn-sm btn-danger move" data-action="remove" data-id="${item.id}"> 刪除 </button>
      </td>
    </tr>`;
  });
  productList.innerHTML = str;
  productCount.textContent = productData.length;
}

// 上方表單
function addProduct(){
  let productObj = {
    id: Date.now(),
    title: productTitle.value,
    origin_price: productOriginPrice.value,
    price: productPrice.value,
    is_enable: false
  }

  productData.push(productObj);
  renderData();
  productTitle.value = '';
  productOriginPrice.value = '';
  productPrice.value = '';
}

function clearAllProduct(e){
  // e.preventDefault();
  // button 標籤預設值是 submit，如果沒設定 type=button，會提交表單畫面導致重整，需要預防
  productData = [];
  renderData();
}

// 下方表單
function editProduct(e){
  // console.log(e.target.attributes['data-action'].value);

  console.log(e.target.dataset.action);
}



//* program start

btnAddProduct.addEventListener('click', addProduct);
btnClearAll.addEventListener('click', clearAllProduct);

// 下方表單
productList.addEventListener('click', editProduct);
