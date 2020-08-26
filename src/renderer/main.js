import Vue from 'vue';

import App from './App';
import router from './router';
import firebase from "firebase/app";

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyCbsJTh9uzknT8zv6QON6pBzR3VDf7iZnk",
  authDomain: "chathub-656c4.firebaseapp.com",
  databaseURL: "https://chathub-656c4.firebaseio.com",
  projectId: "chathub-656c4",
  storageBucket: "chathub-656c4.appspot.com",
  messagingSenderId: "803132677884",
  appId: "1:803132677884:web:4162c395236906c23d0179"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.firebase = firebase;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');
