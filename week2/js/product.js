/**
 * functional specification
 * todo: 取得所有產品資料並呈現
 * todo: 用戶可以刪除單一產品
 */

const productList = document.querySelector("#productList");
const productCount = document.querySelector("#productCount");


const app = {
  data: {
    products: []
  },
  getProducts(page = 1){
    axios.get(`${url}api/${path}/admin/products?page=${page}`)
      .then(res => {
        console.log(res);
        // console.log(this);
        if (res.data.success) {
          this.data.products = res.data.products;
        } else {
          swal(res.data.message, "Wrong", "error")
            .then(res => {
              window.location.href = "login.html";
            })
        }
        this.renderData();

      })
      .catch(err => console.log(err))
  },
  renderData(){
    let str = '';
    this.data.products.forEach((item, index) => {
      str += `<tr>
      <td>${item.title}</td>
      <td width="120">
      ${item.origin_price}
      </td>
      <td width="120">
      ${item.price}
      </td>
      <td width="100">
        <span class="${item.is_enabled ? 'text-success' : 'text-secondary'}">${item.is_enabled ? '啟用' : '未啟用'}</span>
      </td>
      <td width="120">
        <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove" data-id="${item.id}"> 刪除 </button>
      </td>
      </tr>`;
    });
    productList.innerHTML = str;
    productCount.textContent = this.data.products.length;
    productList.addEventListener('click', this.editProduct.bind(this));

  },
  editProduct(e){
    let behavior = e.target.dataset;
    if (behavior.action === "remove") {
      swal({
        title: "你確定要刪除嗎?",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(res => {
        if (res) {
          this.deleteProduct(behavior.id);
        }
      })

      // console.log(this);
    }
  },
  deleteProduct(prodID){
    // /api/:api_path/admin/product/:product_id
    axios.delete(`${url}api/${path}/admin/product/${prodID}`)
      .then(res => {
        console.log(res);
        if (res.data.success) {
          swal({
            title: "刪除成功",
            icon: "success"
          }).then(res => {
            this.getProducts();
          })
        }
      })
      .catch(err => console.log(err))
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.getProducts();
  }
}

app.created();

console.clear();