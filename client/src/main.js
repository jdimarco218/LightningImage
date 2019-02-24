import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io';
import VueSwal from 'vue-swal'
import VueQRCodeComponent from 'vue-qrcode-component'
import 'bootstrap'; import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapVue from 'bootstrap-vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';

Vue.component('qr-code', VueQRCodeComponent)
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(VueSwal);
Vue.use(BootstrapVue);

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://69.141.47.76:5008',
}))
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
