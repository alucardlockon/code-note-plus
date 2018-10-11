<template>
    <el-container>
        <el-header style="-webkit-app-region: drag">
            <h1 style="padding-top: 10px">Welcome to CodeNotePlus</h1>
        </el-header>
        <el-main>
            <el-tabs v-model="activeName" type="border-card" style="height: 550px">
                <el-tab-pane label="工作流" name="workflow" >
                    <workflow></workflow>
                </el-tab-pane>
                <el-tab-pane label="笔记" name="note">笔记</el-tab-pane>
                <el-tab-pane label="Web应用" name="webapp">
                    <web-app></web-app>
                </el-tab-pane>
                <el-tab-pane label="API文档" name="apidoc">API文档</el-tab-pane>
                <el-tab-pane label="代码片段" name="snippets">代码片段</el-tab-pane>
                <el-tab-pane label="设置" name="config">设置</el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
  import Workflow from './workflow/Workflow'
  import WebApp from './webapp/WebApp'
  import {ipcRenderer} from 'electron'
  export default {
    name: 'main-page',
    components: {Workflow, WebApp},
    created () {
      ipcRenderer.on('change-tab', (event, tabName) => {
        this.activeName = tabName
      })
    },
    data () {
      return {
        activeName: 'webapp'
      }
    }
  }
</script>

<style scoped>

</style>