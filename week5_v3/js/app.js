const app = Vue.createApp({
  data() {
    return {
      // 讀取效果
      loadingStatus: {
        loadingItem: ''
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
          address: ''
        },
        message: ''
      },
      // 購物車列表
      cart: {}
    }
  },
  methods: {

  },
  mounted() {
    this.$refs.userProductModal.openModal();
  },
});


app.component('userProductModal', productModal);
app.mount('#app');