<template>
    <div>
        <el-row>
            <el-col :span="6" v-for="app in apps" :key="app.id" :offset="1">
                <el-card :body-style="{ padding: '0px' }">
                    <div style="padding: 14px;">
                        <span>{{app.name}}</span>
                        <div>{{app.intro}}</div>
                        <div class="bottom clearfix">
                            <el-button type="text" class="button" @click="openApp(app)">打开</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
                :title="this.runningapp.name"
                :visible.sync="dialogvisible"
                width="600px">
            <div>
                <app-string-tools v-if="this.runningapp.id===1"></app-string-tools>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogvisible = false;runningapp={}">关 闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
  import AppStringTools from './apps/StringTools'
  export default {
    name: 'code-app',
    components: {AppStringTools},
    data: function () {
      return {
        apps: [
          {id: 1, name: 'string tool', intro: '一个字符串相关的工具'}
        ],
        runningapp: false,
        dialogvisible: false
      }
    },
    methods: {
      openApp (app) {
        this.runningapp = app
        this.dialogvisible = true
      }
    }
  }
</script>

<style scoped>

</style>