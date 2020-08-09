<template>
  <div>
    <van-nav-bar
      title="处理"
      fixed
    />
    <base-page>
      <van-search
        v-model="keywords"
        placeholder="请输入搜索关键词"
      />
      <van-tabs
        v-model="activeTab"
        color="#1989fa"
      >
        <van-tab title="指派给我">
          <van-empty description="暂无数据" />
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
    };
  },
};
</script>
