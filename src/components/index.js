import Vue from 'vue';
import BasePage from './BasePage.vue';
import TicketItem from './TicketItem.vue';
import TicketTag from './TicketTag.vue';

Vue.component('BasePage', BasePage);
Vue.component('TicketItem', TicketItem);
Vue.component('TicketTag', TicketTag);

export {
  BasePage,
  TicketItem,
  TicketTag,
};

export default {
  BasePage,
  TicketItem,
  TicketTag,
};
