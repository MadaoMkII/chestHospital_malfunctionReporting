import Vue from 'vue';
import BasePage from './BasePage.vue';
import TicketItem from './TicketItem.vue';
import TicketTag from './TicketTag.vue';
import OperationHistoryItem from './OperationHistoryItem.vue';
import RateText from './RateText.vue';
import FormUploader from './FormUploader.vue';
import RateTextSelector from './RateTextSelector.vue';
import ListUploadedFiles from './ListUploadedFiles.vue';

Vue.component('BasePage', BasePage);
Vue.component('TicketItem', TicketItem);
Vue.component('TicketTag', TicketTag);
Vue.component('OperationHistoryItem', OperationHistoryItem);
Vue.component('RateText', RateText);
Vue.component('FormUploader', FormUploader);
Vue.component('RateTextSelector', RateTextSelector);
Vue.component('ListUploadedFiles', ListUploadedFiles);

export {
  BasePage,
  TicketItem,
  TicketTag,
  OperationHistoryItem,
  RateText,
  FormUploader,
  RateTextSelector,
  ListUploadedFiles,
};

export default {
  BasePage,
  TicketItem,
  TicketTag,
  OperationHistoryItem,
  RateText,
  FormUploader,
  RateTextSelector,
  ListUploadedFiles,
};
