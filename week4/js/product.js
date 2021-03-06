import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';
import pagination from '../js/pagination.js';


let productModal = {}; // 定義接近全域，若是放在 mounted 裡，作用域只在 mounted，其它地方不能用
// let productModal = null; 也可以
let delProductModal = {};

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      apiPath: 'tedkuo',
      products: [],
      isNew: false,
      tempProduct: { // 稍後調整資料、建立新產品時使用的結構。暫存資料的用途
        imagesUrl: [] // 有第二層資料的情況，先定義起來是為了避免錯誤
      },
      pagination: {}
    }
  },
  components: {
    pagination
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
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static'
    });

    this.getProducts();

  },
  methods: {
    getProducts(page=1) { // 當沒有傳入值時，預設為 1
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          } else {
            alert('wrong');
          }
        }).catch((err) => {

        });
    },
    openModal(cond, item) {

      // this.isNew = isNew
      // if (this.isNew) {
      //   // 通常暫存用途的結構，在使用前會清空
      //   this.tempProduct = {
      //     imagesUrl: []
      //   };
      // } else {
      //   this.tempProduct = {...item};
      // }
      // productModal.show();
      //* add new product
      if (cond === "new") {
        this.tempProduct = {
          imagesUrl: [""]
        };
        this.isNew = true;
        productModal.show();
      } else if (cond === "edit") { //* edit product
        this.tempProduct = {...item};
        this.isNew = false;
        productModal.show();
      } else if (cond === "delete") { //* delete product
        this.tempProduct = { ...item };
        delProductModal.show()
      }


    },
    createImages() {
      this.tempProduct.imagesUrl = [''];
    },
    updateProduct(tempProduct) {

      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct.id}`;
        method = 'put';
      }

      axios[method](url, {data: tempProduct})
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.getProducts();
            productModal.hide();
          }
        })

    },
    delProduct(tempProduct2) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct2.id}`;
      axios.delete(url).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          delProductModal.hide();
          this.getProducts();
        } else {
          alert(response.data.message);
        }
      });
    }
  },
});

// app.component('pagination', {
// });

app.component('productModal', {
  template: `      <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
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
                <div class="col-sm-4">
                  <div class="form-group">
                    <label for="imageUrl">主要圖片</label>
                    <input v-model="tempProduct.imageUrl" type="text" class="form-control" placeholder="請輸入圖片連結">
                    <img class="img-fluid" :src="tempProduct.imageUrl">
                  </div>
                  <div class="mb-1">多圖新增</div>
                  <div v-if="Array.isArray(tempProduct.imagesUrl)">
                    <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                      <div class="form-group">
                        <label for="imageUrl">圖片網址</label>
                        <input type="text" class="form-control"
                          placeholder="請輸入圖片連結" v-model="tempProduct.imagesUrl[key]">
                      </div>
                      <img class="img-fluid" :src="image">
                    </div>
                    <div>
                      <button class="btn btn-outline-primary btn-sm d-block w-100" @click="tempProduct.imagesUrl.push('')">
                        新增圖片
                      </button>
                    </div>
                    <div v-if="tempProduct.imagesUrl.length !== 0">
                      <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                        刪除圖片
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="createImages">
                      新增圖片(array)
                    </button>
                  </div>
                </div>
                <div class="col-sm-8">
                  <div class="form-group">
                    <label for="title">標題</label>
                    <input id="title" type="text" class="form-control" v-model="tempProduct.title" placeholder="請輸入標題">
                  </div>

                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="category">分類</label>
                      <input id="category" type="text" class="form-control" v-model="tempProduct.category" placeholder="請輸入分類">
                    </div>
                    <div class="form-group col-md-6">
                      <label for="unit">單位</label>
                      <input id="unit" type="text" class="form-control" v-model="tempProduct.unit" placeholder="請輸入單位">
                    </div>
                  </div>

                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="origin_price">原價</label>
                      <input id="origin_price" type="number" min="0" class="form-control" v-model.number="tempProduct.origin_price" placeholder="請輸入原價">
                    </div>
                    <div class="form-group col-md-6">
                      <label for="price">售價</label>
                      <input id="price" type="number" min="0" class="form-control" v-model.number="tempProduct.price" placeholder="請輸入售價">
                    </div>
                  </div>
                  <hr>

                  <div class="form-group">
                    <label for="description">產品描述</label>
                    <textarea id="description" type="text" class="form-control" v-model="tempProduct.description" placeholder="請輸入產品描述">
                    </textarea>
                  </div>
                  <div class="form-group">
                    <label for="content">說明內容</label>
                    <textarea id="content" type="text" class="form-control" v-model="tempProduct.content" placeholder="請輸入說明內容">
                    </textarea>
                  </div>
                  <div class="form-group">
                    <div class="form-check">
                      <input id="is_enabled" class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
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
              <button type="button" class="btn btn-primary" @click="$emit('update-product', tempProduct)">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      `,
  props: ['tempProduct']
})

app.component('delProductModal', {
  template: `<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
           aria-labelledby="delProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
              <h5 id="delProductModalLabel" class="modal-title">
                <span>刪除產品</span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              是否刪除
              <strong class="text-danger" v-model="tempProduct2.title"></strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                取消
              </button>
              <button type="button" class="btn btn-danger" @click="$emit('delete-product', tempProduct2)">
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </div>`,
  props: ['tempProduct2']
})

app.mount("#app");