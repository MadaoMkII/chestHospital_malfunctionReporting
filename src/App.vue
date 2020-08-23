<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  background-color: #fafafa;
}

.has-submit-bar {
  margin-bottom: 50px;
}

.submit-bar {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.sticky-searchbar {
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>
