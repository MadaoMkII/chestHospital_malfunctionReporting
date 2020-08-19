<template>
  <div>
    <van-nav-bar
      title="处理"
      fixed
    />
    <base-page>
      <div class="sticky-searchbar searchbar">
        <van-search
          class="searchbar__search"
          v-model="keywords"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @clear="onSearch"
        />
        <van-dropdown-menu class="searchbar__dropdown-menu custom-dropdown-menu">
          <van-dropdown-item
            v-model="filter"
            :options="filterOptions"
            @change="onFilterChange"
          >
            <template #title>
              <van-icon name="filter-o" />
            </template>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <van-tabs
        class="sticky-tabs"
        v-model="tab"
        color="#1989fa"
        @change="onTabChange"
        @click="onTabClick"
      >
        <van-tab
          title="指派给我"
          name="指派给我"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onListRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onListLoad"
            >
              <ticket-item
                v-for="item in list"
                :key="item.uuid"
                :data="item"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
        <van-tab
          title="我的协作"
          name="我的协作"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onListRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onListLoad"
            >
              <ticket-item
                v-for="item in list"
                :key="item.uuid"
                :data="item"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
      </van-tabs>
    </base-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      page: 1,
      total: 0,
      refreshing: false,
      loading: false,
      finished: false,
      isDirty: false,
      keywords: '',
      filter: '全部',
      filterOptions: [
        { text: '全部', value: '全部' },
        { text: '未分配', value: '未分配' },
        { text: '未接单', value: '未接单' },
        { text: '处理中', value: '处理中' },
        { text: '已完成', value: '已完成' },
        { text: '已评价', value: '已评价' },
        { text: '已关闭', value: '已关闭' },
      ],
      tab: '指派给我',
    };
  },
  created() {
    if (this.$route.query.keywords) {
      this.keywords = this.$route.query.keywords;
    }
    if (this.$route.query.filter) {
      this.filter = this.$route.query.filter;
    }
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.keywords) {
      this.keywords = to.query.keywords;
    }
    if (to.query.filter) {
      this.filter = to.query.filter;
    }
    if (to.query.tab) {
      this.tab = to.query.tab;
    }
    next();
  },
  methods: {
    async fetchList(params) {
      const response = await this.$axios.post('/api/malfunctionReporting/getMalfunctionReportingList', params);
      return {
        data: response.data.data,
        total: response.data.totalCount,
      };
    },
    onFilterChange() {
      this.list = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.isDirty = false;
      this.$router.push({
        name: 'processes',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
          filter: this.filter,
          tab: this.tab,
        },
      });
      setTimeout(() => {
        this.onListLoad();
      }, 500);
    },
    async onListLoad() {
      let role = '';
      switch (this.tab) {
        case '指派给我':
          role = '负责';
          break;
        case '我的协作':
          role = '协助';
          break;
        default:
          role = '';
          break;
      }

      const { data, total } = await this.fetchList({
        unit: 15,
        page: this.page,
        role,
        status: this.filter,
        title: this.keywords ? this.keywords : undefined,
      });
      if (this.refreshing) {
        this.list = data;
        this.refreshing = false;
      } else {
        this.list.push(...data);
      }
      this.total = total;
      this.page += 1;
      this.loading = false;
      if (this.list.length === this.total) {
        this.finished = true;
      }
      this.isDirty = true;
    },
    onListRefresh() {
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.$router.push({
        name: 'processes',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
          filter: this.filter,
          tab: this.tab,
        },
      }).catch(() => {});
      this.onListLoad();
    },
    onSearch() {
      this.list = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.isDirty = false;
      this.$router.push({
        name: 'processes',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
          filter: this.filter,
          tab: this.tab,
        },
      }).catch(() => {});
      this.onListLoad();
    },
    onTabChange() {
      this.list = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.isDirty = false;
      setTimeout(() => {
        this.onListLoad();
      }, 500);
    },
    onTabClick() {
      this.$router.push({
        name: 'processes',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
          filter: this.filter,
          tab: this.tab,
        },
      }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.sticky-tabs {
  &::v-deep {
    .van-tabs__wrap {
      position: sticky;
      top: 54px;
      z-index: 1;
    }
  }
}

.searchbar {
  display: flex;
  background-color: #fff;
  align-items: center;
  padding-right: 15px;
  &__search {
    flex-grow: 1;
    padding: 10px 10px 10px 15px;
  }
  &__dropdown-menu {
    flex-shrink: 1;
  }
}

.custom-dropdown-menu {
  &::v-deep .van-dropdown-menu__bar {
    height: auto;
    box-shadow: none;
    .van-dropdown-menu__title {
      padding: 5px;
      &::after {
        display: none;
      }

      .van-icon {
        display: block;
        line-height: 24px;
      }
    }
  }
}
</style>
