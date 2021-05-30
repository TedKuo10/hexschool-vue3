/**
 * todo: 檢查是否持續登入 V
 * todo: 取得、呈現產品 V
 * todo: 新增產品
 *   todo: bs modal 實體
 *   todo: 實作 modal 方法
 * todo: 刪除產品
 * todo: 編輯產品
 */

let productModal = '';

const app = Vue.createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io",
      apiPath: "tedkuo",
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: []
      }
    }
  },
  methods: {
    getProducts(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then(res => {
          console.log(res.data.products);
          if (res.data.success) {
            this.products = res.data.products;
          } else {
            swal(res.data.message, "Wrong", "error")
              .then(res => {
                window.location.href = "login.href";
              })
          }
        })
        .catch(err =>{
          console.log(err);
        })

    },
    openModal(cond, item) {
      //* add new product
      if (cond === "new") {
        this.tempProduct = {
          imagesUrl: []
        };
        this.isNew = true;
        productModal.show();
      } else if (cond === "edit") { //* edit product
        this.tempProduct = {...item};
        this.isNew = false;
        productModal.show();
      }


      //* delete product
    },
    addImg() {
      this.tempProduct.imagesUrl.push("");
      // this.modalObj.imgInputShow = !this.modalObj.imgInputShow;

    },
    updateProduct() {

      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let httpMethod = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }

      axios[httpMethod](url, {data: this.tempProduct})
        .then((res) => {
          if (res.data.success) {
            swal({
              title: res.data.message,
              icon: "success",
              button: true
            }).then(res => {
              productModal.hide();
              this.getProducts();
            })
          } else {
            alert(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
    }
  },
  mounted() {

    //* 實體化 bs modal
    productModal = new bootstrap.Modal(document.getElementById("productModal"), {
      keyboard: false,
      backdrop: 'static'
    });

    //* login status validation
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (token === "") {
      swal("尚未登入", "請重新登入", "warning")
        .then((result) => {
          window.location.href = "login.html";
        }).catch((err) => {
          console.log(err);
        });
    }
    axios.defaults.headers.common.Authorization = token;


    this.getProducts();
  }
});


app.mount("#app");