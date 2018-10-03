<template>
    <div>
        <h1>Welcome to CodeNotePlus</h1>
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="工作流" name="workflow">
                <workflow :height="300"></workflow>
            </el-tab-pane>
            <el-tab-pane label="笔记" name="note">笔记</el-tab-pane>
            <el-tab-pane label="Web应用" name="webapp">Web应用</el-tab-pane>
            <el-tab-pane label="API文档" name="apidoc">API文档</el-tab-pane>
            <el-tab-pane label="代码片段" name="snippets">代码片段</el-tab-pane>
            <el-tab-pane label="设置" name="config">设置</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import Workflow from './workflow/Workflow'
  import {ipcRenderer} from 'electron'
  export default {
    name: 'main-page',
    components: {Workflow},
    created () {
      ipcRenderer.on('change-tab', (event, tabName) => {
        this.activeName = tabName
      })
    },
    data () {
      return {
        activeName: 'workflow'
      }
    }
  }
</script>

<style scoped>

</style>