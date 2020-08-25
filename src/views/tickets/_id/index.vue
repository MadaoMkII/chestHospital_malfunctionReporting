<template>
  <div v-if="ticket">
    <van-nav-bar
      title="工单处理"
      fixed
      left-arrow
      @click-left="routerBack()"
    />
    <base-page :no-bottom="isNoBottom">
      <!--      <pre style="overflow: auto">-->
      <!--        是否为服务项目负责人: {{ isMaintenanceAdministrator }}-->
      <!--        是否为工单管理员: {{ isTicketAdministrator }}-->
      <!--        是否为提交人: {{ isSubmitter }}-->
      <!--        是否为协作者: {{ isHelper }}-->
      <!--      </pre>-->
      <div class="ticket-card">
        <div class="ticket-card__header van-hairline--bottom">
          {{ ticket.title }}
        </div>
        <div class="ticket-card__body ticket-card__body--padding">
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
              优先级
            </div>
            <div class="ticket-item__value">
              {{ ticket.priority }}
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
              {{ ticket.deviceName }}
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
          <div
            v-if="ticket.accessories && ticket.accessories.length > 0 && accessToken"
            class="ticket-item ticket-item--full"
          >
            <list-uploaded-files
              :access-token="accessToken"
              :data="ticket.accessories"
            />
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
            <div>
              <operation-history-item
                v-for="(operationHistory, i) in operationHistoryList"
                :key="i"
                :data="operationHistory"
                :access-token="accessToken"
              />
            </div>
          </van-list>
        </div>
      </div>
    </base-page>
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
      <template v-else-if="ticket.status === '已完成' && isSubmitter">
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
      <template v-else-if="ticket.status === '已完成' && isSubmitter">
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
    <template v-else-if="isHelper">
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
            <form-uploader v-model="finishTicketForm.fileList" />
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
            <rate-text-selector v-model="evaluationTicketForm.rate" />
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
      title="回复工单"
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
            <form-uploader v-model="replayTicketForm.fileList" />
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
        fileList: [],
      },
      // 评价表单
      showEvaluationTicketForm: false,
      evaluationTicketForm: {
        rate: 3,
        content: '',
      },
      // 评论表单
      showReplayTicketForm: false,
      replayTicketForm: {
        content: '',
        fileList: [],
      },
      // Other
      fromRouteName: null,
      accessToken: null,
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
    isHelper() {
      const userFound = this.ticket.assistant.find((user) => user.USERID === this.user.USERID);
      return userFound !== undefined;
    },
    isNoBottom() {
      if (this.isMaintenanceAdministrator) {
        if (this.ticket.status === '未接单' || this.ticket.status === '处理中' || (this.ticket.status === '已完成' && this.isSubmitter)) {
          return false;
        }
      } else if (this.isTicketAdministrator) {
        if (this.ticket.status === '处理中' || (this.ticket.status === '已完成' && this.isSubmitter)) {
          return false;
        }
      } else if (this.isHelper) {
        if (this.ticket.status === '未接单' || this.ticket.status === '处理中' || this.ticket.status === '已完成') {
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // eslint-disable-next-line no-param-reassign
      vm.fromRouteName = from.name;
    });
  },
  async created() {
    this.ticket = await this.fetchTicket({ uuid: this.$route.params.id });
    this.accessToken = await this.fetchAccessToken();
  },
  methods: {
    routerBack() {
      if (this.fromRouteName) {
        this.$router.back();
      } else {
        this.$router.replace({ name: 'index' });
      }
    },
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
      return response.data.data;
    },
    async fetchAccessToken() {
      return (await this.$axios.get('/api/user/getToken')).data.data;
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
      const { data, totalCount } = await this.fetchOperationHistoryList({
        uuid: this.$route.params.id,
        unit: 15,
        page: this.operationHistoryPage,
      });
      this.operationHistoryList.push(...data);
      this.operationHistoryTotal = totalCount;
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
      if (this.finishTicketForm.fileList.find((file) => file.status === 'uploading') !== undefined) {
        this.$notify({ type: 'danger', message: '附件正在上传，请等待上传完成再试' });
        return;
      }
      if (this.isLoading) return;
      this.$dialog.confirm({
        title: '工单处理',
        message: '请确认工单是否已处理完成，一经确认将无法修改！',
      }).then(async () => {
        try {
          this.isLoading = true;
          const fileList = [];
          for (let i = 0; i < values['附件'].length; i += 1) {
            fileList.push({ media_id: values['附件'][i].mediaId, accessoryType: values['附件'][i].file.type });
          }
          await this.$axios.post('/api/malfunctionReporting/approveMalfunctionReporting', {
            uuid: this.$route.params.id,
            content: values['处理详情'],
            result: values['处理结果'],
            media_ids: fileList,
          });
          await this.updateTicket();
          this.$notify({ type: 'success', message: '工单已完成' });
          this.showFinishTicketForm = false;
          this.finishTicketForm = {
            type: '',
            content: '',
            fileList: [],
          };
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
            rating: this.evaluationTicketForm.rate,
          });
          await this.updateTicket();
          this.$notify({ type: 'success', message: '评价成功' });
          this.showEvaluationTicketForm = false;
          this.evaluationTicketForm = {
            rate: 3,
            content: '',
          };
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
      if (this.replayTicketForm.fileList.find((file) => file.status === 'uploading') !== undefined) {
        this.$notify({ type: 'danger', message: '附件正在上传，请等待上传完成再试' });
        return;
      }
      if (this.isLoading) return;
      this.$dialog.confirm({
        title: '提示',
        message: '确认要回复工单吗?',
      }).then(async () => {
        try {
          this.isLoading = true;
          const fileList = [];
          for (let i = 0; i < values['附件'].length; i += 1) {
            fileList.push({ media_id: values['附件'][i].mediaId, accessoryType: values['附件'][i].file.type });
          }
          await this.$axios.post('/api/malfunctionReporting/replyMalfunctionReporting', {
            uuid: this.$route.params.id,
            content: values['回复内容'],
            media_ids: fileList,
          });
          await this.updateTicket();
          this.$notify({ type: 'success', message: '回复成功' });
          this.showReplayTicketForm = false;
          this.replayTicketForm = {
            content: '',
            fileList: [],
          };
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

    &--padding {
      padding: 5px 0;
    }
  }
}

.ticket-item {
  $self: &;

  padding: 5px 16px;
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
