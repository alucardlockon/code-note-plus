<template>
    <el-container>
        <el-aside width="200px">
            <el-row>
                <el-button-group>
                    <el-button icon="el-icon-refresh" title="刷新" @click="loadFolder"></el-button>
                    <el-button icon="el-icon-document" title="打开文件夹" @click="openFolder"></el-button>
                    <el-button type="danger" icon="el-icon-delete" title="删除" @click="deleteFile"></el-button>
                </el-button-group>
                <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
            </el-row>
            <div style="height: 400px">
                <el-tree
                        class="filter-tree"
                        :data="treebarData"
                        default-expand-all
                        :filter-node-method="filterNode"
                        @node-click="nodeClick"
                        v-model="treeSel"
                        ref="treebar">
                </el-tree>
            </div>
        </el-aside>
        <el-main>
            work-flows
        </el-main>
        <el-aside width="200px">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>属性</span>
                </div>
                <div class="text item" style="height: 380px">
                    <tree-view :data="fileContent" :options="{maxDepth: 3,modifiable: true}"></tree-view>
                </div>
            </el-card>
        </el-aside>
    </el-container>
</template>

<script>
  import fs from 'fs'
  import _ from 'lodash'
  export default {
    name: 'workflow',
    created () {
      this.loadFolder()
    },
    watch: {
      filterText (val) {
        this.$refs.treebar.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      nodeClick (obj, node, tree) {
        fs.readFile(this.$store.state.AppInfo.workflowsDir + '/' + obj.label, 'utf-8', (x, data) => {
          this.fileContent = JSON.parse(data)
        })
      },
      openFolder () {
        require('electron').shell.showItemInFolder(this.$store.state.AppInfo.workflowsDir)
      },
      loadFolder () {
        // 测试用: 展示static下文件
        // let files = fs.readdirSync('static/workflows', 'utf-8')
        let files = fs.readdirSync(this.$store.state.AppInfo.workflowsDir, 'utf-8')
        this.treebarData = _.map(files, (x, i) => { return {id: i, label: x} })
      },
      deleteFile () {
        const tempNode = this.$refs.treebar.getCurrentNode()
        if (tempNode && _.find(this.treebarData, tempNode)) {
          fs.unlinkSync(this.$store.state.AppInfo.workflowsDir + '/' + tempNode.label)
          this.loadFolder()
        } else {
          this.$message('请选择文件')
        }
      }
    },
    data () {
      return {
        fileContent: {},
        filterText: '',
        treebarData: [],
        treeSel: ''
      }
    }
  }
</script>

<style scoped>
</style>