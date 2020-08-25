<template>
  <div class="list-uploaded-files">
    <template v-for="(file, i) in data">
      <div
        v-if="isImageFile(file)"
        :key="i"
        class="list-uploaded-files__item"
        @click="imagePreview(file)"
      >
        <van-image
          fit="cover"
          width="100%"
          height="100%"
          :src="getFileURL(file)"
        />
      </div>
      <div
        v-else-if="isVideoFile(file)"
        :key="i"
        class="list-uploaded-files__item"
        @click="videoPreview(file)"
      >
        <div class="list-uploaded-files__item__icon van-icon van-icon-video-o" />
        <div class="list-uploaded-files__item__name van-ellipsis">
          {{ file.type }}
        </div>
      </div>
      <div
        v-else
        :key="i"
        class="list-uploaded-files__item"
        @click="openOrDownload(file)"
      >
        <div class="list-uploaded-files__item__icon van-icon van-icon-description" />
        <div class="list-uploaded-files__item__name van-ellipsis">
          {{ file.type }}
        </div>
      </div>
    </template>
    <van-overlay
      ref="videoPreview"
      :show="isShowVideo"
      @click="isShowVideo = false"
      z-index="99"
    >
      <div
        v-if="isShowVideo"
        class="video-container"
        @click="isShowVideo = false"
      >
        <video
          controls
          width="100%"
          @click.stop
        >
          <source
            :src="videoURL"
            type="video/mp4"
          >
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isShowVideo: false,
      videoURL: null,
    };
  },
  mounted() {
    document.body.insertBefore(this.$refs.videoPreview, document.body.lastChild);
  },
  methods: {
    openOrDownload(file) {
      window.open(this.getFileURL(file), '_blank');
    },
    getFileURL(file) {
      if (file.localMediaId) return `/api/getAccessory/${file.localMediaId}`;
      return `/wx-api/cgi-bin/media/get?access_token=${this.accessToken}&media_id=${file.mediaId}`;
    },
    isImageFile(file) {
      return file.type === 'image/jpeg' || file.type === 'image/png';
    },
    isVideoFile(file) {
      return file.type === 'video/quicktime' || file.type === 'video/mp4';
    },
    imagePreview(file) {
      ImagePreview([this.getFileURL(file)]);
    },
    videoPreview(file) {
      this.isShowVideo = true;
      this.videoURL = this.getFileURL(file);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-uploaded-files {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px -8px 0;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    margin: 0 8px 8px 0;
    background-color: #f7f8fa;

    &__icon {
      color: #646566;
      font-size: 20px;
    }
    &__name {
      box-sizing: border-box;
      width: 100%;
      margin-top: 8px;
      padding: 0 4px;
      color: #646566;
      font-size: 12px;
      text-align: center;
    }

    &:active {
      background-color: #f2f3f5;
    }
  }
}

.video-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
