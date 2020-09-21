import Vue from 'vue';

import App from './App';
import router from './router';
import firebase from "firebase/app";
import * as firebaseKey from "./firebase_key"

Vue.config.productionTip = false;

// Firebase設定
firebase.initializeApp(firebaseKey.firebaseConfig);
window.firebase = firebase;

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');
