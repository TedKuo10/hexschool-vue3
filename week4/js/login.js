
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      user: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    login() {

      axios.post(`${this.apiUrl}/admin/signin`, this.user)
        .then((res) => {
          console.log(res);
          const {token, expired} = res.data;
          document.cookie = `hexToken=${token};expires=${new Date(expired)}`;

          if (res.data.success) {
            swal(res.data.message, "帳密正確", "success")
              .then( res => {
                window.location.href = "product.html"
              })
          } else {
            swal(res.data.message, "帳密錯誤", "error")
              .then((res) => {
                this.user.username = '';
                this.user.password = '';
              })
          }

        }).catch((err) => {
          console.log(err)
        });
    }
  },
});


app.mount("#app");