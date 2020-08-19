<template>
  <div>
    <van-nav-bar
      title="报修"
      fixed
    />
    <base-page>
      <button @click="getTest">
        Get Test
      </button>
      <button @click="setTest">
        Set Test
      </button>
      <button @click="clearTest">
        Clear Test
      </button>
      <div class="s-list">
        <div
          class="s-list__item"
          @click="$router.push({ name: 'submit', query: { department: '总务科' } })"
        >
          <div class="s-list__item__icon s-list__item__icon--a" />
          <div class="s-list__item__main">
            <div class="s-list__item__main__title">
              总务科报修
            </div>
            <div class="s-list__item__main__subtitle">
              关于电、水、气相关报修
            </div>
          </div>
        </div>
        <div
          class="s-list__item"
          @click="$router.push({ name: 'submit', query: { department: '设备科' } })"
        >
          <div class="s-list__item__icon s-list__item__icon--b" />
          <div class="s-list__item__main">
            <div class="s-list__item__main__title">
              设备科报修
            </div>
            <div class="s-list__item__main__subtitle">
              关于设备器材报修
            </div>
          </div>
        </div>
        <div
          class="s-list__item"
          @click="$router.push({ name: 'submit', query: { department: '网管中心' } })"
        >
          <div class="s-list__item__icon s-list__item__icon--c" />
          <div class="s-list__item__main">
            <div class="s-list__item__main__title">
              网管中心报修
            </div>
            <div class="s-list__item__main__subtitle">
              关于网络、信息化相关报修
            </div>
          </div>
        </div>
        <div
          class="s-list__item"
          @click="$router.push({ name: 'submit', query: { department: '保卫科' } })"
        >
          <div class="s-list__item__icon s-list__item__icon--d" />
          <div class="s-list__item__main">
            <div class="s-list__item__main__title">
              保卫科报修
            </div>
            <div class="s-list__item__main__subtitle">
              保卫器材报修
            </div>
          </div>
        </div>
      </div>
      <div
        class="s-note"
        @click="showDescriptionDialog"
      >
        <van-icon
          class="s-note__icon"
          name="info"
        />报修说明
      </div>
    </base-page>
  </div>
</template>

<style lang="scss" scoped>
.s-list {
  margin: 20px 15px;
  &__item {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    display: flex;
    box-shadow:0px 2px 7px 0px rgba(96,108,141,0.1);
    border-radius:6px;
    &__icon {
      width: 60px;
      height: 60px;
      background-size: contain;
      margin-right: 15px;
      &--a {
        background-image: url("~@/assets/s-list-icon-a.png");
      }
      &--b {
        background-image: url("~@/assets/s-list-icon-b.png");
      }
      &--c {
        background-image: url("~@/assets/s-list-icon-c.png");
      }
      &--d {
        background-image: url("~@/assets/s-list-icon-d.png");
      }
    }
    &__main {
      &__title {
        font-size:17px;
        font-weight:600;
        color:rgba(51,51,51,1);
        line-height: 35px;
      }
      &__subtitle {
        font-size:12px;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height: 25px;
      }
    }
  }
}

.s-note {
  margin: 40px 15px 20px;
  height:25px;
  font-size:12px;
  font-weight:400;
  color:rgba(31,126,255,1);
  display: flex;
  align-items: center;

  &__icon {
    margin-right: 5px;
  }
}
</style>

<script>
export default {
  methods: {
    showDescriptionDialog() {
      this.$dialog.alert({
        title: '报修说明',
        message: '报修申告处理完毕后，请务必填写评价，否则将无法再次申告，谢谢。',
        confirmButtonText: '知道啦',
      });
    },
    async clearTest() {
      const response = await this.$axios.get('/api/malfunctionReporting/getMalfunctionCatalog');
      for (let i = 0; i < response.data.data.length; i += 1) {
        console.log(response.data.data[i]);
        // eslint-disable-next-line no-await-in-loop
        await this.$axios.post('/api/malfunctionReporting/setMalfunctionCatalog', {
          id: response.data.data[i].id,
        });
      }
    },
    async getTest() {
      const response = await this.$axios.get('/api/malfunctionReporting/getMalfunctionCatalog');
      for (let i = 0; i < response.data.data.length; i += 1) {
        console.log(response.data.data[i]);
        // // eslint-disable-next-line no-await-in-loop
        // await this.$axios.post('/api/malfunctionReporting/setMalfunctionCatalog', {
        //   id: response.data.data[i].id,
        // });
      }
    },
    async setTest() {
      for (let i = 0; i < 2; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await this.$axios.post('/api/malfunctionReporting/setMalfunctionCatalog', {
          id: `${i}`,
          principalsUserId: ['DaiHuiKanWoLianSeHangShi'],
          name: `一级目录${i}`,
          category: '总务科',
          // parentId: '2',
        });
        for (let j = 0; j < 3; j += 1) {
          // eslint-disable-next-line no-await-in-loop
          await this.$axios.post('/api/malfunctionReporting/setMalfunctionCatalog', {
            id: `${i}-${j}`,
            principalsUserId: ['DaiHuiKanWoLianSeHangShi'],
            name: `二级目录${j}`,
            category: '总务科',
            parentId: `${i}`,
          });
          for (let k = 0; k < 2; k += 1) {
            // eslint-disable-next-line no-await-in-loop
            await this.$axios.post('/api/malfunctionReporting/setMalfunctionCatalog', {
              id: `${i}-${j}-${k}`,
              principalsUserId: ['DaiHuiKanWoLianSeHangShi'],
              name: `三级目录${k}`,
              category: '总务科',
              parentId: `${i}-${j}`,
            });
          }
        }
      }
    },
  },
};
</script>
