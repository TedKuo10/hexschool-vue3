import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';


let productModal = {}; // 定義接近全域，若是放在 mounted 裡，作用域只在 mounted，其它地方不能用
// let productModal = null; 也可以

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      apiPath: 'tedkuo',
      products: [],
      tempProduct: { // 稍後調整資料、建立新產品時使用的結構。暫存資料的用途
        imagesUrl: [] // 有第二層資料的情況，先定義起來是為了避免錯誤
      }
    }
  },
  mounted() { // 要取得資料又要取得 DOM 元素

    //* login status validation
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;

    // Bootstrap 實體化
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static'
    });

    this.getProducts();

  },
  methods: {
    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            console.log('GOoD')
            this.products = res.data.products;
          } else {
            alert('wrong');
          }
        }).catch((err) => {
          
        });
    },
    openModal() {
      // 通常暫存用途的結構，在使用前會清空
      this.tempProduct = {
        imagesUrl: []
      };
      productModal.show();
    },
    createImages() {
      this.tempProduct.imagesUrl = [''];
    }
  },
});

app.mount("#app");