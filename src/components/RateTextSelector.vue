<template>
  <div class="rate-text-selector">
    <div
      class="rate-text-selector__item"
      :class="{ 'rate-text-selector__item--active': value === 5 }"
      @click="$emit('input', 5)"
    >
      非常满意
    </div>
    <div
      class="rate-text-selector__item"
      :class="{ 'rate-text-selector__item--active': value === 4 }"
      @click="$emit('input', 4)"
    >
      比较满意
    </div>
    <div
      class="rate-text-selector__item"
      :class="{ 'rate-text-selector__item--active': value === 3 }"
      @click="$emit('input', 3)"
    >
      一般
    </div>
    <div
      class="rate-text-selector__item"
      :class="{ 'rate-text-selector__item--active': value === 2 }"
      @click="$emit('input', 2)"
    >
      不满意
    </div>
    <div
      class="rate-text-selector__item"
      :class="{ 'rate-text-selector__item--active': value === 1 }"
      @click="$emit('input', 1)"
    >
      非常不满意
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.rate-text-selector {
  display: flex;
  flex-wrap: wrap;
  margin: -5px;
  &__item {
    margin: 5px;
    background:rgba(255,255,255,1);
    border-radius:20px;
    border:1px solid rgba(153,153,153,1);
    font-size:14px;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:20px;
    padding: 5px 10px;
    text-align: center;

    &--active {
      border: 1px solid #1F7EFF;
      background:#1F7EFF;
      color: #fff;
    }
  }
}
</style>
