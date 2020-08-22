<template><span class="rate-text">{{ rateText }}</span></template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    rateText() {
      switch (this.value) {
        case 1:
          return '非常不满意';
        case 2:
          return '不满意';
        case 3:
          return '一般';
        case 4:
          return '比较满意';
        case 5:
          return '非常满意';
        default:
          return this.value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rate-text {
  font-weight: 600;
}
</style>
