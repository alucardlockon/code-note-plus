import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/MainPage').default,
      children: [
        { path: '', component: require('@/components/workflow/steps/Default').default },
        { path: 'mysql', component: require('@/components/workflow/steps/Mysql').default },
        { path: 'gen-code', component: require('@/components/workflow/steps/GenCode').default }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
