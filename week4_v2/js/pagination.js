export default {
  props: ['page'],
  methods: {
    getProduct(nowPage) {
      // console.log(nowPage);
      this.$emit('get-product', nowPage);
    }
  },
  template: `<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{'disabled': !page.has_pre}">
      <a class="page-link" href="#" @click="getProduct(page.current_page-1)" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"
      :class="{'active': item === page.current_page}"
      v-for="item in page.total_pages" :key="item">
      <a class="page-link" href="#" @click="getProduct(item)">{{ item }}</a>
    </li>
    <li class="page-item" :class="{'disabled': !page.has_next}">
      <a class="page-link" href="#" @click="getProduct(page.current_page+1)" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>`,
  created() {
    console.log(this.page);
  },
}