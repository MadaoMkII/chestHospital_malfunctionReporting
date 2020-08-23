<template>
  <div
    class="base-page"
    :class="{ 'base-page--no-bottom': noBottom }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    noBottom: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-page {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow: auto;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  &--no-bottom {
    bottom: 0;
  }
}
</style>
