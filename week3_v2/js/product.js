import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.0-beta.4/vue.esm-browser.min.js';

let productModal = {}; // 定義接近全域變數
let delProductModal = {};

const app = createApp({
  data() {
    return {
      apiURL: 'https://vue3-course-api.hexschool.io',
      apiPath: 'tedkuo',
      products: [],
      isNew: false,
      tempProduct: { // 稍後調整資料使用的準備結構
        // **針對第二層**，資料裡面多做額外定義，可以避免非預期的錯誤
        imagesUrl: [],
      }
    }
  },
  // 想要取得資料，又需要取得 DOM 元素
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;

    // Boostrap 實體
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: false
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: false
    });

    this.getProducts();
  },
  methods: {
    getProducts() {
      const url = `${this.apiURL}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
          } else {
            alert(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    openModal(cond, item) {
      console.log(cond);

      if (cond === 'add') {
        this.tempProduct = {
          imagesUrl: []
        };
        this.isNew = true;
        productModal.show();
      } else if (cond === 'edit') {
        this.tempProduct = JSON.parse(JSON.stringify(item));
        this.isNew = false;
        productModal.show();
      } else if (cond === 'delete') {
        this.tempProduct = item;
        delProductModal.show();
      }

    },
    updateProduct() {
      let url = `${this.apiURL}/api/${this.apiPath}/admin/product/`;
      let method = 'post';

      if (!this.isNew) {
        url = `${this.apiURL}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }
      axios[method](url, {data: this.tempProduct})
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.getProducts();
            productModal.hide();
          } else {
            console.log(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    deleteProduct() {
      const url = `${this.apiURL}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            alert(res.data.message);
            delProductModal.hide();
            this.getProducts();
          } else {
            alert(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
    }
  },
});

app.mount('#app');

// console.clear();