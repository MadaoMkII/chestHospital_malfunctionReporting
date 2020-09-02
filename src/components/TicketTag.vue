<template>
  <div
    class="ticket-tag"
    :class="tagColor ? `ticket-tag--${tagColor}` : ''"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: '',
    },
  },
  computed: {
    tagColor() {
      switch (this.status) {
        case '未分配':
          return 'gray';
        case '未接单':
          return 'yellow';
        case '处理中':
          return 'red';
        case '已完成':
          return 'blue';
        case '已评价':
          return 'green';
        case '已关闭':
          return 'light-gray';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ticket-tag {
  flex-shrink: 0;
  font-size:10px;
  font-weight:400;
  color:rgba(255,255,255,1);
  background:rgba(153,153,153,1);
  border-radius:2px;
  line-height: 20px;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 5px;

  &--gray {
    background:rgba(153,153,153,1);
  }

  &--yellow {
    background:rgba(243,198,53,1);
  }
  &--red {
    background:rgba(226,49,76,1);
  }
  &--blue {
    background:rgba(31,126,255,1);
  }
  &--green {
    background:rgba(88,204,91,1);
  }
  &--light-gray {
    background:rgba(206,206,206,1);
  }
}
</style>
