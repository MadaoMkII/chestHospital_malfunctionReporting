import Vue from 'vue';
import BasePage from './BasePage.vue';
import TicketItem from './TicketItem.vue';
import TicketTag from './TicketTag.vue';
import OperationHistoryItem from './OperationHistoryItem.vue';
import RateText from './RateText.vue';

Vue.component('BasePage', BasePage);
Vue.component('TicketItem', TicketItem);
Vue.component('TicketTag', TicketTag);
Vue.component('OperationHistoryItem', OperationHistoryItem);
Vue.component('RateText', RateText);

export {
  BasePage,
  TicketItem,
  TicketTag,
  OperationHistoryItem,
  RateText,
};

export default {
  BasePage,
  TicketItem,
  TicketTag,
  OperationHistoryItem,
  RateText,
};
