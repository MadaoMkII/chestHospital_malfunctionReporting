<template>
  <div>
    <router-view />
    <van-tabbar
      route
      safe-area-inset-bottom
    >
      <van-tabbar-item
        icon="service-o"
        :to="{ name: 'index' }"
      >
        申告
      </van-tabbar-item>
      <van-tabbar-item
        icon="todo-list-o"
        :to="{ name: 'processes' }"
      >
        处理
      </van-tabbar-item>
      <van-tabbar-item
        icon="user-o"
        :to="{ name: 'my' }"
      >
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
