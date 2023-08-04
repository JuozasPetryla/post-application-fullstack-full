import Vue from 'vue';
import App from './App.vue';
import vueDebounce from 'vue-debounce'
import router from './router/router';
import store from './store/store';
import './main.css'
import createWebSocketPlugin from './plugins/socketIo';

Vue.use(createWebSocketPlugin);


import BaseCard from './components/UI/BaseCard.vue'
import BaseButton from './components/UI/BaseButton.vue'
import BasePostDialog from './components/UI/BasePostDialog.vue'
import BaseAuthorDialog from './components/UI/BaseAuthorDialog.vue'
import BaseInfoDialog from './components/UI/BaseInfoDialog.vue'
import BaseNotification from './components/UI/BaseNotification.vue'

Vue.component('BaseCard', BaseCard)
Vue.component('BaseButton', BaseButton)
Vue.component('BasePostDialog', BasePostDialog)
Vue.component('BaseAuthorDialog', BaseAuthorDialog)
Vue.component('BaseInfoDialog', BaseInfoDialog)
Vue.component('BaseNotification', BaseNotification)

Vue.use(vueDebounce)


new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount('#app');
