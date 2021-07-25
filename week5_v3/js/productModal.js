export default {
  template: `<div
  class="modal fade"
  id="productModal"
  tabindex="-1"
  role="dialog"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
  ref="modal"
>
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>{{ tempProduct.title }}</span>
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-6">
            <img class="img-fluid" :src="tempProduct.imageUrl" alt="" />
          </div>
          <div class="col-sm-6">
            <span class="badge bg-primary rounded-pill">{{ tempProduct.category }}</span>
            <p>商品描述：{{ tempProduct.description }}</p>
            <p>商品內容：{{ tempProduct.content }}</p>
            <div class="h5">{{ tempProduct.price }} 元</div>
            <del class="h6">原價 {{ tempProduct.origin_price }} 元</del>
            <div class="h5">現在只要 {{ tempProduct.price }} 元</div>
            <div>
              <div class="input-group">
                <input type="number" class="form-control" min="1" v-model.number="qty" />
                <button type="button" class="btn btn-primary" @click="addCart(tempProduct.id, qty)">
                  加入購物車
                </button>
              </div>
            </div>
          </div>
          <!-- col-sm-6 end -->
        </div>
      </div>
    </div>
  </div>
</div>`,
  props: ['product'],
  data() {
    return {
      status: {},
      tempProduct: {},
      modal: '',
      qty: 1
    }
  },
  watch: {
    // 避免單一數據流的問題，所以打算將傳進的 product 資料，並寫入 tempProduct
    // 要監聽 product 的變化
    product() {
      this.tempProduct = this.product;
    }

  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
  methods: {
    addCart(id, qty) {
      this.$emit('add-cart', id, qty);
    },
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    }
  },
}