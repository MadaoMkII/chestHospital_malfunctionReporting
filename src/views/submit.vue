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
            :value="service"
            label="服务项目"
            placeholder="点击选择服务项目"
            :rules="[{ required: true, message: '服务项目不能不选' }]"
          />
          <van-field
            required
            v-model="title"
            name="标题"
            label="标题"
            placeholder="请输入标题"
            :rules="[{ required: true, message: '标题不能为空' }]"
            maxlength="80"
          />
          <van-field
            required
            v-model="device"
            name="设备名称"
            label="设备名称"
            placeholder="请输入故障设备或部位名称"
            :rules="[{ required: true, message: '故障设备或部位名称不能为空' }]"
            maxlength="80"
          />
          <van-field
            required
            v-model="description"
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
            name="uploader"
            label="附件上传"
          >
            <template #input>
              <van-uploader v-model="uploader" />
            </template>
          </van-field>
          <van-field
            required
            :rules="[{ required: true, message: '优先级不能不选' }]"
            readonly
            clickable
            name="优先级"
            :value="priority"
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
      service: '',
      title: '',
      device: '',
      description: '',
      uploader: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' }],
      priority: '',
      showPriorityPicker: false,
      priorityPickerColumns: ['普通', '重要不紧急', '紧急不重要', '重要且紧急'],
    };
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values);
    },
    onPriorityPickerConfirm(priority) {
      this.priority = priority;
      this.showPriorityPicker = false;
    },
  },
};
</script>
