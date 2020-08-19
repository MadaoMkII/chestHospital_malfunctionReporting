<template>
  <div v-if="ticket">
    <van-nav-bar
      title="工单处理"
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <base-page>
      <div class="ticket-card">
        <div class="ticket-card__header van-hairline--bottom">
          {{ ticket.title }}
        </div>
        <div class="ticket-card__body">
          <div class="ticket-item">
            <div class="ticket-item__label">
              提交人
            </div>
            <div class="ticket-item__value">
              {{ `${ticket.creator.nickName}（${ticket.category}）` }}
            </div>
          </div>
          <div class="ticket-item">
            <div class="ticket-item__label">
              服务项目
            </div>
            <div class="ticket-item__value">
              {{ ticket.malfunctionCatalogFullName }}
            </div>
          </div>
          <div class="ticket-item">
            <div class="ticket-item__label">
              设备名称
            </div>
            <div class="ticket-item__value">
              接口未提供
            </div>
          </div>
          <div class="ticket-item ticket-item--full">
            <div class="ticket-item__label">
              故障描述
            </div>
            <div class="ticket-item__value">
              {{ ticket.content }}
            </div>
          </div>
        </div>
      </div>
      <div class="ticket-card">
        <div class="ticket-card__header">
          工单状态<ticket-tag :status="ticket.status">
            {{ ticket.status }}
          </ticket-tag>
        </div>
      </div>
      <div
        class="ticket-card"
        style="margin-bottom: 10px;"
      >
        <div class="ticket-card__header van-hairline--bottom">
          流转
        </div>
        <div class="ticket-card__body">
          <van-list
            v-model="operationHistoryLoading"
            :finished="operationHistoryFinished"
            @load="onOperationHistoryLoad"
          >
            <pre
              class="van-hairline--bottom"
              style="overflow: auto; margin: 0;"
              v-for="(operationHistory, i) in operationHistoryList"
              :key="i"
            >{{ operationHistory }}</pre>
          </van-list>
        </div>
      </div>
      <div class="submit-bar">
        <van-grid
          clickable
          :column-num="4"
        >
          <van-grid-item
            clickable
            text="回复"
          />
          <van-grid-item
            clickable
            text="指派"
          />
          <van-grid-item
            clickable
            text="退回"
          />
          <van-grid-item
            clickable
            text="协作"
          />
        </van-grid>
      </div>
    </base-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      operationHistoryList: [],
      operationHistoryPage: 1,
      operationHistoryTotal: 100,
      operationHistoryLoading: false,
      operationHistoryFinished: false,
      ticket: null,
    };
  },
  async created() {
    this.ticket = await this.fetchTicket({ uuid: this.$route.params.id });
  },
  methods: {
    async fetchTicket(params) {
      const response = await this.$axios.post('/api/malfunctionReporting/getMalfunctionReportingDetail', params);
      return response.data.data;
    },
    async fetchOperationHistoryList(params) {
      const response = await this.$axios.post('/api/malfunctionReporting/getMalfunctionReportingOperationHistory', params);
      return response.data;
    },
    async take() {
      const response = await this.$axios.post('/api/malfunctionReporting/pickUpMalfunctionReporting', {
        uuid: this.$route.params.id,
      });
      console.log(response);
    },
    async onOperationHistoryLoad() {
      const { data } = await this.fetchOperationHistoryList({
        uuid: this.$route.params.id,
        unit: 1000,
        page: this.operationHistoryPage,
      });
      const total = data.length;
      this.operationHistoryList.push(...data);
      this.operationHistoryTotal = total;
      this.operationHistoryPage += 1;
      this.operationHistoryLoading = false;
      if (this.operationHistoryList.length === this.operationHistoryTotal) {
        this.operationHistoryFinished = true;
      }
    },
  },
};
</script>

<style lang="scss">
.ticket-card {
  margin-top: 10px;
  &__header {
    padding: 8px 16px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    line-height: 30px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__body {
    background-color: #fff;
  }
}

.ticket-item {
  $self: &;

  padding: 10px 16px;
  display: flex;

  &__label {
    width: 86px;
    flex-shrink: 0;
    font-size:14px;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:26px;
  }
  &__value {
    flex: 1;
    font-size:14px;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:26px;
  }

  &--full {
    display: block;
    #{ $self }__label {
      width: 100%;
    }
  }
}
</style>
