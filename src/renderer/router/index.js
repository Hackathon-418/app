import Vue from 'vue';
import Router from 'vue-router';
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../components/Index'),
    beforeEnter: (to, from, next) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log(user)
          next()
        } else {
          next("/signin");
        }
      });
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import(/* webpackChunkName: "about" */ '../components/Register')
  },
  {
    path: "/signin",
    name: "signIn",
    component: () => import(/* webpackChunkName: "about" */ '../components/SignIn')
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
