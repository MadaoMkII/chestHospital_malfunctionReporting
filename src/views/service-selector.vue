<template>
  <div>
    <van-nav-bar
      title="服务项目"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <base-page no-bottom />
  </div>
</template>

<script>
export default {
  data() {
    return {
      serviceList: [],
    };
  },
  async created() {
    this.serviceList = await this.fetchServiceList();
  },
  methods: {
    async fetchServiceList() {
      const response = await this.$axios.get('/api/malfunctionReporting/getMalfunctionCatalog', { params: { category: this.$route.query.category } });
      return response.data.data;
    },
  },
};
</script>
