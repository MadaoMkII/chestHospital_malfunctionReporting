<template>
  <div v-if="ticket">
    <van-nav-bar
      title="工单处理"
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <base-page :no-bottom="isNoBottom">
      <pre style="overflow: auto">
        isMaintenanceAdministrator: {{ isMaintenanceAdministrator }}
        isTicketAdministrator: {{ isTicketAdministrator }}
        isSubmitter: {{ isSubmitter }}
      </pre>
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
              {{ `${ticket.creator.nickName}（${ticket.creator.apartmentName}）` }}
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
      <template v-if="isMaintenanceAdministrator">
        <template v-if="ticket.status === '未接单'">
          <div class="submit-bar">
            <van-grid
              clickable
              :column-num="4"
            >
              <van-grid-item
                clickable
                text="回复"
                @click="showReplayTicketForm = true"
              />
              <van-grid-item
                clickable
                text="指派"
                @click="$router.push({ name: 'tickets-id-principal-user-selector-department-id', params: { id: $route.params.id, departmentId: '1' } })"
              />
              <van-grid-item
                clickable
                text="协作"
                @click="$router.push({ name: 'tickets-id-cooperation-user-selector-department-id', params: { id: $route.params.id, departmentId: '1' } })"
              />
              <van-grid-item
                clickable
                text="接单"
                @click="takeTicket()"
              />
            </van-grid>
          </div>
        </template>
        <template v-else-if="ticket.status === '处理中'">
          <div class="submit-bar">
            <van-grid
              clickable
              :column-num="4"
            >
              <van-grid-item
                clickable
                text="回复"
                @click="showReplayTicketForm = true"
              />
              <van-grid-item
                clickable
                text="指派"
                @click="$router.push({ name: 'tickets-id-principal-user-selector-department-id', params: { id: $route.params.id, departmentId: '1' } })"
              />
              <van-grid-item
                clickable
                text="协作"
                @click="$router.push({ name: 'tickets-id-cooperation-user-selector-department-id', params: { id: $route.params.id, departmentId: '1' } })"
              />
              <van-grid-item
                clickable
                text="处理"
                @click="showFinishTicketForm = true"
              />
            </van-grid>
          </div>
        </template>
      </template>
      <template v-else-if="isTicketAdministrator">
        <template v-if="ticket.status === '处理中'">
          <div class="submit-bar">
            <van-grid
              clickable
              :column-num="4"
            >
              <van-grid-item
                clickable
                text="回复"
                @click="showReplayTicketForm = true"
              />
              <van-grid-item
                clickable
                text="指派"
                @click="$router.push({ name: 'tickets-id-principal-user-selector-department-id', params: { id: $route.params.id, departmentId: '1' } })"
              />
              <van-grid-item
                clickable
                text="协作"
                @click="$router.push({ name: 'tickets-id-cooperation-user-selector-department-id', params: { id: $route.params.id, departmentId: '1' } })"
              />
              <van-grid-item
                clickable
                text="处理"
                @click="showFinishTicketForm = true"
              />
            </van-grid>
          </div>
        </template>
      </template>
      <template v-else-if="isSubmitter">
        <template v-if="ticket.status === '未接单' || ticket.status === '处理中'">
          <div class="submit-bar">
            <van-grid
              clickable
              :column-num="1"
            >
              <van-grid-item
                clickable
                text="回复"
                @click="showReplayTicketForm = true"
              />
            </van-grid>
          </div>
        </template>
        <template v-else-if="ticket.status === '已完成'">
          <div class="submit-bar">
            <van-grid
              clickable
              :column-num="1"
            >
              <van-grid-item
                clickable
                text="评价"
                @click="showEvaluationTicketForm = true"
              />
            </van-grid>
          </div>
        </template>
      </template>
    </base-page>
    <van-action-sheet
      v-model="showFinishTicketForm"
      title="处理工单"
    >
      <van-form @submit="onFinishTicketFormSubmit">
        <van-field
          required
          :rules="[{ required: true, message: '处理结果不能不选' }]"
          readonly
          clickable
          name="处理结果"
          :value="finishTicketForm.type"
          label="处理结果"
          placeholder="点击选择处理结果"
          @click="showFinishTicketTypePicker = true"
        />
        <van-field
          required
          v-model="finishTicketForm.content"
          name="处理详情"
          label="处理详情"
          placeholder="请输入处理详情"
          :rules="[{ required: true, message: '处理详情不能为空' }]"
          maxlength="200"
          show-word-limit
          rows="4"
          autosize
          type="textarea"
        />
        <van-field
          required
          name="附件"
          label="附件上传"
        >
          <template #input>
            <van-uploader v-model="finishTicketForm.uploadFiles" />
          </template>
        </van-field>
        <div class="van-action-sheet__gap" />
        <button
          type="submit"
          class="van-action-sheet__cancel"
        >
          处理完成
        </button>
      </van-form>
    </van-action-sheet>
    <van-popup
      v-model="showFinishTicketTypePicker"
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="finishTicketTypePickerColumns"
        @confirm="onFinishTicketTypePickerConfirm"
        @cancel="showFinishTicketTypePicker = false"
      />
    </van-popup>
    <van-action-sheet
      v-model="showEvaluationTicketForm"
      title="评价工单"
    >
      <van-form @submit="onEvaluationTicketFormSubmit">
        <van-field
          name="评分"
          label="评分"
        >
          <template #input>
            <van-rate
              v-model="evaluationTicketForm.rate"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
            />
          </template>
        </van-field>
        <van-field
          required
          v-model="evaluationTicketForm.content"
          name="评价"
          label="评价"
          placeholder="请输入评价"
          :rules="[{ required: true, message: '评价不能为空' }]"
          maxlength="200"
          show-word-limit
          rows="4"
          autosize
          type="textarea"
        />
        <div class="van-action-sheet__gap" />
        <button
          type="submit"
          class="van-action-sheet__cancel"
        >
          发布评价
        </button>
      </van-form>
    </van-action-sheet>
    <van-action-sheet
      v-model="showReplayTicketForm"
      title="处理工单"
    >
      <van-form @submit="onReplayTicketFormSubmit">
        <van-field
          required
          v-model="replayTicketForm.content"
          name="回复内容"
          label="回复内容"
          placeholder="请输入回复内容"
          :rules="[{ required: true, message: '回复内容不能为空' }]"
          maxlength="200"
          show-word-limit
          rows="4"
          autosize
          type="textarea"
        />
        <van-field
          required
          name="附件"
          label="附件上传"
        >
          <template #input>
            <van-uploader v-model="replayTicketForm.uploadFiles" />
          </template>
        </van-field>
        <div class="van-action-sheet__gap" />
        <button
          type="submit"
          class="van-action-sheet__cancel"
        >
          发布评论
        </button>
      </van-form>
    </van-action-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      operationHistoryList: [],
      operationHistoryPage: 1,
      operationHistoryTotal: 0,
      operationHistoryLoading: false,
      operationHistoryFinished: false,
      ticket: null,
      isLoading: false,
      // 处理表单
      showFinishTicketForm: false,
      showFinishTicketTypePicker: false,
      finishTicketTypePickerColumns: ['自修', '外修', '保修'],
      finishTicketForm: {
        type: '',
        content: '',
        uploadFiles: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' }],
      },
      // 评价表单
      showEvaluationTicketForm: false,
      evaluationTicketForm: {
        rate: 5,
        content: '',
      },
      // 评论表单
      showReplayTicketForm: false,
      replayTicketForm: {
        content: '',
        uploadFiles: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' }],
      },
    };
  },
  computed: {
    ...mapState(['user']),
    isMaintenanceAdministrator() { // 我是不是服务项目负责人
      return this.ticket.candidate_supervisors.find((user) => user.USERID === this.user.USERID) !== undefined;
    },
    isTicketAdministrator() { // 我是不是工单负责人
      if (this.ticket.principal === undefined) return false;
      return this.ticket.principal.USERID === this.user.USERID;
    },
    isSubmitter() { // 我是不是提交人
      return this.ticket.creator.USERID === this.user.USERID;
    },
    isNoBottom() {
      if (this.isMaintenanceAdministrator) {
        if (this.ticket.status === '未接单' || this.ticket.status === '处理中') {
          return false;
        }
      } else if (this.isTicketAdministrator) {
        if (this.ticket.status === '处理中') {
          return false;
        }
      } else if (this.isSubmitter) {
        if (this.ticket.status === '未接单' || this.ticket.status === '处理中' || this.ticket.status === '已完成') {
          return false;
        }
      }
      return true;
    },
  },
  async created() {
    this.ticket = await this.fetchTicket({ uuid: this.$route.params.id });
    console.log(this.ticket);
    console.log(this.user);
  },
  methods: {
    async updateTicket() {
      this.ticket = await this.fetchTicket({ uuid: this.$route.params.id });
      this.operationHistoryList = [];
      this.operationHistoryPage = 1;
      this.operationHistoryTotal = 0;
      this.operationHistoryLoading = false;
      this.operationHistoryFinished = false;
    },
    async fetchTicket(params) {
      const response = await this.$axios.post('/api/malfunctionReporting/getMalfunctionReportingDetail', params);
      return Object.assign(response.data.data, {
        candidate_supervisors: [{
          USERID: 'DaiHuiKanWoLianSeHangShi',
          apartmentCode: '1',
          apartmentName: '天津实境科技有限公司',
          avatar: 'http://wework.qpic.cn/bizmail/F335CVtyNWTeWcBpUPkw2TchpRytoaOOPIlYR1S23tQnicEpbJEo9Bw/0',
          nickName: '待会看我脸色行事噢',
        }],
        // principal: {
        //   USERID: 'DaiHuiKanWoLianSeHangShi',
        //   apartmentCode: '1',
        //   apartmentName: '天津实境科技有限公司',
        //   avatar: 'http://wework.qpic.cn/bizmail/F335CVtyNWTeWcBpUPkw2TchpRytoaOOPIlYR1S23tQnicEpbJEo9Bw/0',
        //   nickName: '待会看我脸色行事噢',
        // },
        // status: '已评价',
      });
    },
    async fetchOperationHistoryList(params) {
      const response = await this.$axios.post('/api/malfunctionReporting/getMalfunctionReportingOperationHistory', params);
      return response.data;
    },
    async takeTicket() {
      if (this.isLoading) return;
      this.$dialog.confirm({
        title: '提示',
        message: '确认要接单吗?',
      }).then(async () => {
        try {
          this.isLoading = true;
          await this.$axios.post('/api/malfunctionReporting/pickUpMalfunctionReporting', {
            uuid: this.$route.params.id,
          });
          await this.updateTicket();
          this.$notify({ type: 'success', message: '你接取了工单' });
        } catch (e) {
          if (e.response.data && e.response.data.message) {
            this.$notify({ type: 'danger', message: e.response.data.message });
          } else {
            this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
          }
        } finally {
          this.isLoading = false;
        }
      }).catch(() => {});
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
    onFinishTicketTypePickerConfirm(type) {
      this.finishTicketForm.type = type;
      this.showFinishTicketTypePicker = false;
    },
    onFinishTicketFormSubmit(values) {
      if (this.isLoading) return;
      this.$dialog.confirm({
        title: '工单处理',
        message: '请确认工单是否已处理完成，一经确认将无法修改！',
      }).then(async () => {
        try {
          this.isLoading = true;
          await this.$axios.post('/api/malfunctionReporting/approveMalfunctionReporting', {
            uuid: this.$route.params.id,
            content: values['处理详情'],
            result: values['处理结果'],
          });
          await this.updateTicket();
          this.$notify({ type: 'success', message: '工单已完成' });
          this.showFinishTicketForm = false;
        } catch (e) {
          if (e.response.data && e.response.data.message) {
            this.$notify({ type: 'danger', message: e.response.data.message });
          } else {
            this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
          }
        } finally {
          this.isLoading = false;
        }
      }).catch(() => {});
    },
    onEvaluationTicketFormSubmit(values) {
      if (this.isLoading) return;
      this.$dialog.confirm({
        title: '提示',
        message: '确认要评价工单吗?',
      }).then(async () => {
        try {
          this.isLoading = true;
          await this.$axios.post('/api/malfunctionReporting/setRating', {
            uuid: this.$route.params.id,
            content: values['评价'],
            rating: values['评分'],
          });
          await this.updateTicket();
          this.$notify({ type: 'success', message: '评价成功' });
          this.showEvaluationTicketForm = false;
        } catch (e) {
          if (e.response.data && e.response.data.message) {
            this.$notify({ type: 'danger', message: e.response.data.message });
          } else {
            this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
          }
        } finally {
          this.isLoading = false;
        }
      }).catch(() => {});
    },
    onReplayTicketFormSubmit(values) {
      if (this.isLoading) return;
      this.$dialog.confirm({
        title: '提示',
        message: '确认要回复工单吗?',
      }).then(async () => {
        try {
          this.isLoading = true;
          await this.$axios.post('/api/malfunctionReporting/replyMalfunctionReporting', {
            uuid: this.$route.params.id,
            content: values['回复内容'],
          });
          await this.updateTicket();
          this.$notify({ type: 'success', message: '回复成功' });
          this.showReplayTicketForm = false;
        } catch (e) {
          if (e.response.data && e.response.data.message) {
            this.$notify({ type: 'danger', message: e.response.data.message });
          } else {
            this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
          }
        } finally {
          this.isLoading = false;
        }
      }).catch(() => {});
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
