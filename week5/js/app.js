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
      const url = `${apiUrl}/api/${apiPath}/product/${item.id}`;
      axios.get(url)
        .then((res) => {
          console.log(res);
          this.product = res.data.product;
          this.$refs.userProductModal.openModal();
        })
    },
    addCart(id, qty=1) {
      const cart = {
        product_id: id,
        qty
      };
      console.log(cart);
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.post(url, {data: cart})
        .then((res) => {
          console.log(res);
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
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const cart = {
        product_id: item.product.id,
        qty: item.qty
      }
      console.log(cart, url)
      axios.put(url, {data: cart})
        .then((res) => {
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


app.component('userProductModal', productModal);
app.mount('#app');
