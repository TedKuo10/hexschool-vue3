import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.0-beta.4/vue.esm-browser.min.js';
import pagination from './pagination.js'

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
      },
      pagination: {}
    }
  },
  components: {
    pagination
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
    getProducts(page = 1) {
      const url = `${this.apiURL}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
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
    updateProduct(tempProduct) {
      let url = `${this.apiURL}/api/${this.apiPath}/admin/product/`;
      let method = 'post';

      if (!this.isNew) {
        url = `${this.apiURL}/api/${this.apiPath}/admin/product/${tempProduct.id}`;
        method = 'put';
      }
      axios[method](url, {data: tempProduct})
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
    },
    uploadImg(formData) {
      const url = `${this.apiURL}/api/${this.apiPath}/admin/upload`;
      // const fileInput = document.querySelector('#file');
      // // console.dir(fileInput.files[0]);
      // const file = fileInput.files[0];
      // const formData = new FormData();
      // formData.append('file-to-upload', file);

      axios.post(url, formData)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data.imageUrl);
            this.tempProduct.imageUrl = res.data.imageUrl;
          } else {
            console.log(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
    }
  },
});

// productModal 一旦變元件，因為單向數據流的關係，uploadImg 會出問題，因此要把該方法拉進去
app.component('productModal', {
  props: ['tempProduct'],
  template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
           aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
              <h5 id="productModalLabel" class="modal-title">
                <span>新增產品</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <!-- 處理 圖片 -->
                <div class="col-sm-4">
                  <div class="mb-4">
                    <div class="form-group">
                      <label for="imageUrl" class="mb-2 fw-bolder">主要圖片</label>
                      <input type="text" class="form-control mb-1" v-model="tempProduct.imageUrl" placeholder="請輸入圖片連結或上傳圖片">
                      <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                    </div>
                    <div class="form-group">
                      <input type="file" class="form-control" id="file" placeholder="請上傳圖片"/>
                      <button type="button" class="btn btn-primary" @click="uploadImg">上傳</button>
                    </div>
                  </div>
                  <!-- <div>
                    <button class="btn btn-outline-primary btn-sm d-block w-100">
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button class="btn btn-outline-danger btn-sm d-block w-100">
                      刪除圖片
                    </button>
                  </div> -->
                </div>
                <!-- 處理 圖片 結束 -->
                <div class="col-sm-8">
                  <div class="form-group">
                    <label for="title">標題</label>
                    <input id="title" type="text" class="form-control"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題">
                  </div>

                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="category">分類</label>
                      <input id="category" type="text" class="form-control"
                      v-model="tempProduct.category"
                             placeholder="請輸入分類">
                    </div>
                    <div class="form-group col-md-6">
                      <label for="price">單位</label>
                      <input id="unit" type="text" class="form-control"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位">
                    </div>
                  </div>

                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="origin_price">原價</label>
                      <input id="origin_price" type="number" min="0" class="form-control"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價">
                    </div>
                    <div class="form-group col-md-6">
                      <label for="price">售價</label>
                      <input id="price" type="number" min="0" class="form-control"
                      v-model="tempProduct.price"
                             placeholder="請輸入售價">
                    </div>
                  </div>
                  <hr>

                  <div class="form-group">
                    <label for="description">產品描述</label>
                    <textarea id="description" type="text" class="form-control"
                    v-model="tempProduct.description"
                              placeholder="請輸入產品描述">
                    </textarea>
                  </div>
                  <div class="form-group">
                    <label for="content">說明內容</label>
                    <textarea id="description" type="text" class="form-control"
                    v-model="tempProduct.content"
                              placeholder="請輸入說明內容">
                    </textarea>
                  </div>
                  <div class="form-group">
                    <div class="form-check">
                      <input id="is_enabled" class="form-check-input" type="checkbox"
                      v-model="tempProduct.is_enabled"
                             :true-value="1" :false-value="0">
                      <label class="form-check-label" for="is_enabled">是否啟用</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                取消
              </button>
              <button type="button" class="btn btn-primary" @click="updateProduct(tempProduct)">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>`,
  methods: {
    updateProduct(tempProduct) {
      this.$emit('update-product', tempProduct);
    },
    uploadImg() {
      const fileInput = document.querySelector('#file');
      // console.dir(fileInput.files[0]);
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', file);
      this.$emit('upload-img', formData);
    }
  },
});

app.mount('#app');

// console.clear();