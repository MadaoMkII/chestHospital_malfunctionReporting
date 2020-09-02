<template>
  <div
    class="service-item"
    @click="$router.push({ name: 'tickets-id', params: { id: data.uuid } })"
  >
    <div class="service-item__title van-hairline--bottom">
      {{ data.title }}
      <ticket-tag :status="data.status">
        {{ data.status }}
      </ticket-tag>
    </div>
    <div class="service-item__body">
      <div class="service-item__sub">
        服务项目：{{ data.malfunctionCatalogName }}
      </div>
      <div class="service-item__sub">
        受理人：{{ data.principal ? data.principal.nickName : '无' }}<div class="service-item__sub__datetime">
          {{ moment(data.created_at).format('YYYY.MM.DD HH:mm') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      moment,
    };
  },
};
</script>

<style lang="scss" scoped>
.service-item {
  margin: 10px 15px;
  background-color: #fff;
  box-shadow:0px 2px 6px 0px rgba(96,108,141,0.1);
  border-radius:6px;
  &__title {
    line-height: 30px;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size:17px;
    font-weight:600;
    color:rgba(51,51,51,1);
    word-break: break-all;
  }
  &__body {
   padding: 5px 15px;
  }
  &__sub {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    font-size:13px;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height: 25px;
    word-break: break-all;
    &__datetime {
      flex-shrink: 0;
      margin-left: 5px;
    }
  }
}
</style>
