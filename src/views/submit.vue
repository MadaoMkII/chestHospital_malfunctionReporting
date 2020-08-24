<template>
  <div>
    <van-nav-bar
      :title="`${$route.query.department}报修`"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <base-page no-bottom>
      <van-form @submit="onSubmit">
        <van-cell-group title="填写信息">
          <van-field
            is-link
            required
            readonly
            clickable
            name="服务项目"
            :value="ticketForm.service ? ticketForm.service.name : ''"
            label="服务项目"
            placeholder="点击选择服务项目"
            :rules="[{ required: true, message: '服务项目不能不选' }]"
            @click="$router.push({ name: 'service-selector', query: { category: $route.query.department } })"
          />
          <van-field
            required
            v-model="ticketForm.title"
            name="标题"
            label="标题"
            placeholder="请输入标题"
            :rules="[{ required: true, message: '标题不能为空' }]"
            maxlength="80"
          />
          <van-field
            required
            v-model="ticketForm.device"
            name="设备名称"
            label="设备名称"
            placeholder="请输入故障设备或部位名称"
            :rules="[{ required: true, message: '故障设备或部位名称不能为空' }]"
            maxlength="80"
          />
          <van-field
            required
            v-model="ticketForm.description"
            name="故障描述"
            label="故障描述"
            placeholder="请输入故障描述"
            :rules="[{ required: true, message: '故障描述不能为空' }]"
            maxlength="200"
            show-word-limit
            rows="2"
            autosize
            type="textarea"
          />
          <van-field
            name="附件"
            label="附件"
          >
            <template #input>
              <form-uploader v-model="ticketForm.fileList" />
            </template>
          </van-field>
          <van-field
            required
            :rules="[{ required: true, message: '优先级不能不选' }]"
            readonly
            clickable
            name="优先级"
            :value="ticketForm.priority"
            label="优先级"
            placeholder="点击选择优先级"
            @click="showPriorityPicker = true"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button
            block
            type="info"
            native-type="submit"
          >
            提交工单
          </van-button>
        </div>
      </van-form>
    </base-page>
    <van-popup
      v-model="showPriorityPicker"
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="priorityPickerColumns"
        @confirm="onPriorityPickerConfirm"
        @cancel="showPriorityPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      dutyTelephones: null,
      showPriorityPicker: false,
      priorityPickerColumns: ['普通', '不紧急但重要', '紧急但不重要', '紧急且重要'],
    };
  },
  computed: {
    ticketForm: {
      set(value) {
        this.$store.commit('setTicketForm', value);
      },
      get() {
        return this.$store.state.ticketForm;
      },
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'service-selector') {
      this.ticketForm = {
        service: null,
        title: '',
        device: '',
        description: '',
        fileList: [],
        priority: '',
      };
    }
    next();
  },
  async mounted() {
    this.dutyTelephones = await this.fetchDutyTelephones();
    if (!this.isWorkTime()) this.showWorkTime();
  },
  methods: {
    async fetchDutyTelephones(params) {
      const response = await this.$axios.get('/api/systemSetting/getMalfunctionReportingPhoneNumberByCategory', params);
      return response.data.data;
    },
    isWorkTime() {
      const start = moment().startOf('day').add(8, 'hours');
      const end = moment().startOf('day').add(17, 'hours');
      const over = moment().isBetween(start, end);
      return over;
    },
    showWorkTime() {
      this.$dialog({
        title: '不在工作时间提示',
        message: '您好，现在不在工作时间内，我们将在工作时间内第一时间查看并处理您的申报；如果紧急情况，您可以通过电话联系我们。',
        confirmButtonText: `拨打${this.$route.query.department}值班电话`,
        closeOnClickOverlay: true,
      })
        .then(() => {
          // on confirm
          window.open(`tel:${this.dutyTelephones[this.$route.query.department]}`);
        })
        .catch(() => {
          // on cancel
        });
    },
    async onSubmit(values) {
      // if (!this.isWorkTime()) {
      //   this.showWorkTime();
      //   return;
      // }
      if (this.ticketForm.fileList.find((file) => file.status === 'uploading') !== undefined) {
        this.$notify({ type: 'danger', message: '附件正在上传，请等待上传完成再试' });
        return;
      }
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        const fileList = [];
        for (let i = 0; i < values['附件'].length; i += 1) {
          fileList.push({ media_id: values['附件'][i].mediaId, accessoryType: values['附件'][i].file.type });
        }
        await this.$axios.post('/api/malfunctionReporting/createMalfunctionReporting', {
          title: values['标题'],
          content: values['故障描述'],
          category: this.$route.query.department,
          deviceName: values['设备名称'],
          priority: values['优先级'],
          malfunctionCatalogId: this.ticketForm.service.id,
          media_ids: fileList,
        });
        this.ticketForm = {
          service: null,
          title: '',
          device: '',
          description: '',
          fileList: [],
          priority: '',
        };
        this.$notify({ type: 'success', message: '工单提交成功' });
        this.$router.push({ name: 'my' });
      } catch (e) {
        if (e.response.data && e.response.data.message) {
          this.$notify({ type: 'danger', message: e.response.data.message });
        } else {
          this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
        }
      } finally {
        this.isLoading = false;
      }
    },
    onPriorityPickerConfirm(priority) {
      this.ticketForm.priority = priority;
      this.showPriorityPicker = false;
    },
  },
};
</script>
