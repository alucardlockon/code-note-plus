<template>
    <el-container>
        <el-aside width="200px">
            <el-row>
                <el-col :xs="24">
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-plus">文件夹</el-button>
                        <el-button type="danger" icon="el-icon-delete">删除</el-button>
                    </el-button-group>
                    <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterText">
                    </el-input>
                </el-col>
            </el-row>
            <el-tree
                    class="filter-tree"
                    :data="treebarData"
                    default-expand-all
                    :filter-node-method="filterNode"
                    @node-click="nodeClick"
                    ref="treebar">
            </el-tree>
        </el-aside>
        <el-main>
            work-flows
        </el-main>
        <el-aside width="200px">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>属性</span>
                </div>
                <div class="text item">
                    {{fileContent}}
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
      // 测试用: 展示static下文件
      // let files = fs.readdirSync('static/workflows', 'utf-8')
      let files = []
      files.concat(fs.readdirSync(this.$store.state.AppInfo.workflowsDir, 'utf-8'))
      this.treebarData = _.map(files, (x, i) => { return {id: i, label: x} })
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
        fs.readFile(this.$store.state.AppInfo.workflowsDir + '/' + obj.label)
        this.fileContent = fs.readFileSync('')
      }
    },

    data () {
      return {
        fileContent: '',
        filterText: '',
        treebarData: []
      }
    }
  }
</script>

<style scoped>

</style>