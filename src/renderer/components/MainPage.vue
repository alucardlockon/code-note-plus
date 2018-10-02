<template>
    <div>
        <h1>Welcome to CodeNotePlus</h1>
        <el-tabs type="border-card">
            <el-tab-pane label="工作流">
                <workflow :height="300"></workflow>
            </el-tab-pane>
            <el-tab-pane label="笔记">笔记</el-tab-pane>
            <el-tab-pane label="Web应用">Web应用</el-tab-pane>
            <el-tab-pane label="代码片段">代码片段</el-tab-pane>
            <el-tab-pane label="设置">设置</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import Workflow from './workflow/Workflow'
  export default {
    name: 'main-page',
    components: {Workflow}
  }
</script>

<style scoped>

</style>