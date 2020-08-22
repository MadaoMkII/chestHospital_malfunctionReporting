<template>
  <div>
    <van-nav-bar
      title="我的"
      fixed
    />
    <base-page>
      <van-search
        class="sticky-searchbar searchbar__search"
        v-model="keywords"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @clear="onSearch"
      />
      <van-tabs
        class="sticky-tabs"
        v-model="tab"
        color="#1989fa"
        @change="onTabChange"
        @click="onTabClick"
      >
        <van-tab
          title="全部"
          name="全部"
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
          title="处理中"
          name="处理中"
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
          title="已完成"
          name="已完成"
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
          title="已评价"
          name="已评价"
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
          title="已关闭"
          name="已关闭"
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
      tab: '指派给我',
    };
  },
  created() {
    if (this.$route.query.keywords) {
      this.keywords = this.$route.query.keywords;
    }
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.keywords) {
      this.keywords = to.query.keywords;
    }
    if (to.query.tab) {
      this.tab = to.query.tab;
    }
    next();
  },
  methods: {
    async fetchList(params) {
      const response = await this.$axios.post('/api/malfunctionReporting/getMyMalfunctionReportingList', params);
      return {
        data: response.data.data,
        total: response.data.totalCount,
      };
    },
    async onListLoad() {
      const { data, total } = await this.fetchList({
        unit: 15,
        page: this.page,
        status: this.tab,
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
        name: 'my',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
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
        name: 'my',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
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
        name: 'my',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
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
