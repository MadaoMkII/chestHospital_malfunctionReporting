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
            required
            name="附件"
            label="附件上传"
          >
            <template #input>
              <van-uploader v-model="ticketForm.files" />
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
export default {
  data() {
    return {
      showPriorityPicker: false,
      priorityPickerColumns: ['普通', '重要不紧急', '紧急不重要', '重要且紧急'],
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
        files: [],
        priority: '',
      };
    }
    next();
  },
  methods: {
    async onSubmit(values) {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$axios.post('/api/malfunctionReporting/createMalfunctionReporting', {
          title: values['标题'],
          content: values['故障描述'],
          category: this.$route.query.department,
          deviceName: values['设备名称'],
          priority: values['优先级'],
          malfunctionCatalogId: this.ticketForm.service.id,
        });
        this.ticketForm = {
          service: null,
          title: '',
          device: '',
          description: '',
          files: [],
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
