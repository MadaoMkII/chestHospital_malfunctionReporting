<template>
  <van-uploader
    v-model="fileList"
    multiple
    :max-count="3"
    :max-size="1000000 * 20"
    accept=".mp4, .mov, .png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .txt, .ppt, .pptx"
    upload-icon="add-o"
    @oversize="onOversize"
    :after-read="afterRead"
  />
</template>

<script>
import { Toast } from 'vant';

export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  computed: {
    fileList: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    onOversize() {
      Toast('文件大小不能超过 20MB');
    },
    afterRead(file) {
      if (Array.isArray(file)) {
        for (let i = 0; i < file.length; i += 1) {
          this.uploadFile(file[i]);
        }
      } else {
        this.uploadFile(file);
      }
    },
    async uploadFile(file) {
      // eslint-disable-next-line no-param-reassign
      file.status = 'uploading';
      // eslint-disable-next-line no-param-reassign
      file.message = '上传中...';
      try {
        const accessToken = (await this.$axios.get('/api/user/getToken')).data.data;
        const formData = new FormData();
        formData.append('type', 'file');
        formData.append('media', file.file);
        const response = await this.$axios.post('/wx-api/cgi-bin/media/upload', formData, {
          params: {
            access_token: accessToken,
          },
        });
        switch (response.data.errcode) {
          case 0:
            // eslint-disable-next-line no-param-reassign
            file.status = 'done';
            // eslint-disable-next-line no-param-reassign
            file.mediaId = response.data.media_id;
            break;
          default:
            // eslint-disable-next-line no-param-reassign
            file.status = 'failed';
            // eslint-disable-next-line no-param-reassign
            file.message = '上传失败';
            this.$notify({
              type: 'danger',
              message: `上传失败: (${response.data.errcode})${response.data.errmsg}`,
            });
            break;
        }
      } catch (e) {
        // eslint-disable-next-line no-param-reassign
        file.status = 'failed';
        // eslint-disable-next-line no-param-reassign
        file.message = '上传失败';
      }
    },
  },
};
</script>
