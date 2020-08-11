<template>
  <div class="service-item">
    <div class="service-item__title van-hairline--bottom">
      需要维修办公电脑<div class="service-item__title__tag">
        未分配
      </div>
    </div>
    <div class="service-item__body">
      <div class="service-item__sub">
        服务项目：日常办公电脑维修
      </div>
      <div class="service-item__sub">
        受理人：无<div class="service-item__sub__datetime">
        2020.6.31  11:26
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

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
    &__tag {
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
    }
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
