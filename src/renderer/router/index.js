import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/MainPage').default
      /*
      children: [
        { name: 'step-defalut', path: '', component: require('@/components/workflow/steps/Default').default },
        { name: 'step-mysql', path: 'mysql', component: require('@/components/workflow/steps/Mysql').default },
        { name: 'step-gen-code', path: 'step-gen-code', component: require('@/components/workflow/steps/GenCode').default }
      ]
      */
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
