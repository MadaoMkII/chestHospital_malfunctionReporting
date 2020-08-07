<template>
  <div>
    <router-view />
    <van-tabbar
      route
      safe-area-inset-bottom
    >
      <van-tabbar-item
        icon="todo-list-o"
        :to="{ name: 'index' }"
      >
        待评价
      </van-tabbar-item>
      <van-tabbar-item
        icon="user-o"
        :to="{ name: 'index-my' }"
      >
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
