<template>
    <div>
        <div>
            通知中心:
            <div style="margin-left: 20px">
                <div v-if="notifications.length>0">
                    <div v-for="notification in notifications">{{notification}}</div>
                </div>
                <div v-else>
                    很好，目前暂无通知。
                </div>
            </div>
        </div>
        应用:
        <el-row>
            <el-col :span="6" v-for="app in apps" :key="app.id" :offset="1">
                <el-card :body-style="{ padding: '0px' }">
                    <div style="padding: 14px;">
                        <span>{{app.name}}</span>
                        <div class="bottom clearfix">
                            <el-button type="text" class="button" @click="openApp(app)">打开</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
                :title="this.runningApp.name"
                :visible.sync="dialogVisible"
                width="600px">
            <div>
                <app-kanmanhua v-if="this.runningApp.id===1"></app-kanmanhua>
                <app-eleme v-else-if="this.runningApp.id===2"></app-eleme>
                <app-phantom-app v-else></app-phantom-app>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false;runningApp={}">关 闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
  import AppKanmanhua from './apps/kanmanhua'
  import AppEleme from './apps/eleme'
  import AppPhantomApp from './apps/phantomApp'

  export default {
    name: 'web-app',
    components: {AppPhantomApp, AppEleme, AppKanmanhua},
    data () {
      return {
        fileContent: {},
        dialogVisible: false,
        apps: [
          {id: -1, name: 'phnatomApp'},
          {id: 1, name: '看漫画'},
          {id: 2, name: '饿了么'}
        ],
        notifications: [],
        runningApp: {}
      }
    },
    methods: {
      openApp (app) {
        this.runningApp = app
        this.dialogVisible = true
      }
    }
  }
</script>

<style scoped>
</style>