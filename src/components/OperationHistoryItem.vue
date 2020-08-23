<template>
  <div class="opt-history-item">
    <div class="opt-history-item__line" />
    <div class="opt-history-item__dot" />
    <div class="opt-history-item__main">
      <div class="opt-history-item__user">
        {{ data.operator.nickName }}
      </div>
      <div
        v-if="data.action === '创建报修报告'"
        class="opt-history-item__content"
      >
        <div class="opt-history-item__content__text">
          创建工单
        </div>
        <div class="opt-history-item__content__datetime">
          {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
        </div>
      </div>
      <div
        v-else-if="data.action === '接单'"
        class="opt-history-item__content"
      >
        <div class="opt-history-item__content__text">
          接取工单
        </div>
        <div class="opt-history-item__content__datetime">
          {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
        </div>
      </div>
      <div
        v-else-if="data.action === '指派'"
        class="opt-history-item__content"
      >
        <div class="opt-history-item__content__text">
          指派给 <div class="opt-history-item__content__text__user">
            {{ data.detail.nickName }}
          </div>
        </div>
        <div class="opt-history-item__content__datetime">
          {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
        </div>
      </div>
      <div
        v-else-if="data.action === '协同'"
        class="opt-history-item__content"
      >
        <div class="opt-history-item__content__text">
          将 <div
            v-for="(user, i) in data.detail"
            :key="i"
            class="opt-history-item__content__text__user"
          >
            {{ user.nickName }}
          </div> 添加为协作科室
        </div>
        <div class="opt-history-item__content__datetime">
          {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
        </div>
      </div>
      <template v-else-if="data.action === '回复'">
        <div class="opt-history-item__content">
          <div class="opt-history-item__content__text">
            回复
          </div>
          <div class="opt-history-item__content__datetime">
            {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
          </div>
        </div>
        <div class="opt-history-item__replay">
          {{ data.detail.content }}
        </div>
      </template>
      <template v-else-if="data.action === '处理'">
        <div class="opt-history-item__content">
          <div class="opt-history-item__content__text">
            将状态改为 <div class="opt-history-item__content__text__user">
              已完成
            </div>
          </div>
          <div class="opt-history-item__content__datetime">
            {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
          </div>
        </div>
        <div class="opt-history-item__replay">
          处理结果：<div class="opt-history-item__content__text__user">
            {{ data.detail.result }}
          </div><br>
          {{ data.detail.content }}
        </div>
      </template>
      <template v-else-if="data.action === '满意度评价'">
        <div class="opt-history-item__content">
          <div class="opt-history-item__content__text">
            已评价工单
          </div>
          <div class="opt-history-item__content__datetime">
            {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
          </div>
        </div>
        <div class="opt-history-item__replay">
          评价：<rate-text :value="data.detail.rating" /><br>
          {{ data.detail.content }}
        </div>
      </template>
      <div
        v-else
        class="opt-history-item__content"
      >
        <div class="opt-history-item__content__text">
          {{ data.action }}
        </div>
        <div class="opt-history-item__content__datetime">
          {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      moment,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.opt-history-item {
  $self: &;

  position: relative;
  display: flex;
  padding: 10px 16px;

  &__user {
    font-size:16px;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height: 30px;
  }
  &__content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    &__text {
      font-size:14px;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height: 20px;
      &__user {
        display: inline;
        font-weight: bolder;
        color:rgba(51,51,51,1);
      }
    }
    &__datetime {
      flex-shrink: 0;
      font-size:14px;
      font-weight:400;
      color:#999;
      line-height: 20px;
    }
  }
  &__replay {
    margin-top: 10px;
    padding: 10px;
    background:rgba(249,249,249,1);
    border-radius:3px;

    font-size:14px;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:26px;
  }
  &__main {
    flex: 1;
  }
  &__dot {
    width: 11px;
    height: 11px;
    background:rgba(31,126,255,1);
    border-radius: 50%;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 16px;
    position: relative;
    z-index: 1;
  }
  &__line {
    position: absolute;
    top: 0;
    left: 21px;
    bottom: 0;
    width: 1px;
    background-color: #EDEDED;
  }

  &:first-of-type {
    #{ $self }__line {
      top: 20px;
    }
  }

  &:last-of-type {
    &::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 21px;
      bottom: 0;
      width: 1px;
      background-color: #fff;
    }
  }
}
</style>
