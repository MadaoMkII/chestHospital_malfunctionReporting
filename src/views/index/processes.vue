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
        />
        <van-dropdown-menu class="searchbar__dropdown-menu custom-dropdown-menu">
          <van-dropdown-item v-model="filter" :options="filterOptions">
            <template #title>
              <van-icon name="filter-o" />
            </template>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <van-tabs
        class="sticky-tabs"
        v-model="activeTab"
        color="#1989fa"
      >
        <van-tab title="指派给我">
          <service-item v-for="i in 100" :key="i" />
        </van-tab>
        <van-tab title="我的协作">
          <van-empty description="暂无数据" />
        </van-tab>
      </van-tabs>
    </base-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: '',
      keywords: '',
      filter: '',
      filterOptions: [
        { text: '未分配', value: '未分配' },
        { text: '未接单', value: '未接单' },
        { text: '处理中', value: '处理中' },
        { text: '已完成', value: '已完成' },
        { text: '已评价', value: '已评价' },
        { text: '已关闭', value: '已关闭' },
      ],
    };
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
