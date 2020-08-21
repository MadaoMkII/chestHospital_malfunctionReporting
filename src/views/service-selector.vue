<template>
  <div>
    <van-nav-bar
      title="服务项目"
      left-text="返回"
      right-text="确定"
      left-arrow
      @click-left="back()"
      @click-right="confirm()"
      fixed
    />
    <base-page no-bottom>
      <van-cell
        v-for="catalog in currentCatalogList"
        :key="catalog.id"
        :title="catalog.name"
        is-link
        @click="next(catalog)"
      />
      <van-radio-group
        v-if="currentServiceList.length"
        v-model="selectedService"
      >
        <van-cell
          v-for="service in currentServiceList"
          :key="service.id"
          :title="service.name"
          clickable
          @click="selectedService = service.id"
        >
          <template #right-icon>
            <van-radio :name="service.id" />
          </template>
        </van-cell>
      </van-radio-group>
    </base-page>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      deep: 1,
      serviceList: [],
      selectedService: null,
      navs: [],
    };
  },
  computed: {
    currentCatalogList() {
      if (this.$route.query.catalogId) {
        return this.serviceList.filter((service) => service.parentId === this.$route.query.catalogId && this.hasChildren(service));
      }
      return this.serviceList.filter((service) => service.parentId === undefined && this.hasChildren(service));
    },
    currentServiceList() {
      if (this.$route.query.catalogId) {
        return this.serviceList.filter((service) => service.parentId === this.$route.query.catalogId && !this.hasChildren(service));
      }
      return this.serviceList.filter((service) => service.parentId === undefined && !this.hasChildren(service));
    },
    ...mapState(['ticketForm']),
  },
  async created() {
    this.serviceList = await this.fetchServiceList();
  },
  methods: {
    async fetchServiceList() {
      const response = await this.$axios.get('/api/malfunctionReporting/getMalfunctionCatalog', { params: { category: this.$route.query.category } });
      return response.data.data ? response.data.data : [];
    },
    hasChildren(currentService) {
      return this.serviceList.find((service) => service.parentId === currentService.id) !== undefined;
    },
    back() {
      this.deep -= 1;
      this.$router.back();
      this.selectedService = null;
      this.navs.pop();
    },
    next(catalog) {
      this.deep += 1;
      this.$router.push({ name: 'service-selector', query: { category: this.$route.query.category, catalogId: catalog.id } });
      this.selectedService = null;
      this.navs.push(catalog);
    },
    confirm() {
      const selectedService = this.serviceList.find((service) => service.id === this.selectedService);
      this.ticketForm.service = selectedService === undefined ? null : selectedService;
      this.$router.go(-this.deep);
    },
  },
};
</script>
