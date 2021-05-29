

const app = Vue.createApp({
  data() {
    return {
      apiURL: "https://vue3-course-api.hexschool.io",
      user: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    login (){
      axios.post(`${this.apiURL}/admin/signin`, this.user)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            const expired = res.data.expired;
            const token = res.data.token;

            document.cookie = `hexToken=${token}; expired=${new Date(expired)}`;

            swal(res.data.message, "帳密正確", "success")
              .then((result) => {
                window.location.href = "product.html"
              }).catch((err) => {
                console.log(err);
              });


          } else {
            swal(res.data.message, "帳密錯誤", "error")
          }


        }).catch((err) => {
          console.log(err);
        });
    }
  },
  created() {
    
  }
});

app.mount("#app");