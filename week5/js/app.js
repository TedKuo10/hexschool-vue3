import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'tedkuo';

const app = Vue.createApp({
  data() {
    return {
      // 讀取效果 loading
      loadingStatus: {
        loadingItem: '',
      },
      // 產品列表
      products: [],
      // props 傳遞到內層的暫存資料
      product: {},
      // 表單結構
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      // 購物車列表
      cart: {},
    }
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios.get(url)
        .then((res) => {
          // console.log(res);
          this.products = res.data.products;
        })
    },
    openModal(item) {
      console.log(item);
      // ? 為什麼上面已經傳入 item 了，卻不直接拿來用
      // * 因為要避免單向數據流的問題，所以盡可能不要去使用外層傳進來的資料
      // * 之前是因為丟進去的是物件，有傳參考的特性

      this.loadingStatus.loadingItem = item.id;
      const url = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      axios.get(url)
        .then((res) => {
          console.log(res);
          this.product = res.data.product;
          this.loadingStatus.loadingItem = '';
          this.$refs.userProductModal.openModal();
        })
    },
    addCart(id, qty=1) {
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty
      };
      console.log(cart);
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.post(url, {data: cart})
        .then((res) => {
          console.log(res);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
    },
    getCart() {

      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url)
        .then((res) => {
          this.cart = res.data.data
        })
    },
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const cart = {
        product_id: item.product.id,
        qty: item.qty
      }
      console.log(cart, url)
      axios.put(url, {data: cart})
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          console.log(res);
        })
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
    // this.$refs.userProductModal.openModal();

  },
})

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.component('userProductModal', productModal);
app.mount('#app');
