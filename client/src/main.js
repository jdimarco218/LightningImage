import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io';
import VueSwal from 'vue-swal'
import VueQRCodeComponent from 'vue-qrcode-component'

Vue.component('qr-code', VueQRCodeComponent)
Vue.use(VueSwal);

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://69.141.47.76:5008',
}))
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
