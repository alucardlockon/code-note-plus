<template>
    <el-container>
        <el-aside width="230px">
            <el-row>
                <el-button-group>
                    <el-button icon="el-icon-plus" title="新建" @click="addNew"></el-button>
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
            <workflow-view :data="fileContent" ref="workflowview" @item-click="viewItemClick" @fileSave="fileSave"
            @run="run" @item-add="itemAdd" @item-delete="itemDelete" @item-move-up="itemMoveUp" @item-move-down="itemMoveDown"></workflow-view>
        </el-main>
        <el-aside width="250px" style="height: 470px;">
            <el-input v-model="fileContent.name"></el-input>
            <el-collapse v-model="activeNames" style="height: 420px;overflow-y: auto;overflow-x:hidden">
                <el-collapse-item title="文件属性" name="1">
                    <tree-view :data="fileContent" :options="{maxDepth: 3,modifiable: false}"></tree-view>
                </el-collapse-item>
                <el-collapse-item title="基本属性" name="2">
                    <el-form>
                        <el-form-item label="名称">
                            <el-input v-model="selection.name"></el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="selection.type">
                                <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="步骤参数" name="3">
                    <step-mysql v-if="selection.type==='mysql'" :params="selection.params"></step-mysql>
                    <step-gen-code v-else-if="selection.type==='gen-code'" :params="selection.params"></step-gen-code>
                    <step-javascript v-else-if="selection.type==='javascript'" :params="selection.params"></step-javascript>
                    <step-variable v-else-if="selection.type==='variable'" :params="selection.params"></step-variable>
                    <step-request v-else-if="selection.type==='request'" :params="selection.params"></step-request>
                    <step-default v-else></step-default>
                </el-collapse-item>
            </el-collapse>
        </el-aside>
    </el-container>
</template>

<script>
  import fs from 'fs'
  import _ from 'lodash'
  import workflowView from './WorkflowView'
  import StepMysql from './steps/Mysql'
  import StepDefault from './steps/Default'
  import StepGenCode from './steps/GenCode'
  import {run} from '../common/workflow'
  import StepJavascript from './steps/Javascript'
  import StepVariable from './steps/Variable'
  import StepRequest from './steps/Request'
  export default {
    name: 'workflow',
    components: {StepRequest, StepVariable, StepJavascript, StepGenCode, StepDefault, StepMysql, workflowView},
    data () {
      return {
        fileContent: {},
        filterText: '',
        treebarData: [],
        treeSel: '',
        activeNames: ['3'],
        selection: {},
        file: {},
        typeOptions: [
          { value: 'mysql', label: 'mysql连接' },
          { value: 'gen-code', label: '生成代码' },
          { value: 'javascript', label: '运行javascript' },
          { value: 'variable', label: '定义变量' },
          { value: 'request', label: '发送请求' }
        ]
      }
    },
    created () {
      this.loadFolder()
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      nodeClick (obj, node, tree) {
        fs.readFile(this.$store.state.AppInfo.workflowsDir + '/' + obj.label, 'utf-8', (x, data) => {
          this.fileContent = JSON.parse(data)
          this.file.name = obj.label
          this.selection = {}
        })
      },
      openFolder () {
        require('electron').shell.showItemInFolder(this.$store.state.AppInfo.workflowsDir)
      },
      loadFolder () {
        // 测试用: 展示static下文件
        // let files = fs.readdirSync('static/workflows', 'utf-8')
        let files = fs.readdirSync(this.$store.state.AppInfo.workflowsDir, 'utf-8')
        _.pull(files, '.DS_Store')
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
      },
      viewItemClick (step) {
        this.selection = step
      },
      fileSave () {
        if (!this.file.name) {
          this.$message.error('没有选择文件')
          return
        }
        fs.writeFile(this.$store.state.AppInfo.workflowsDir + '/' + this.file.name, JSON.stringify(this.fileContent),
          'utf-8', (x) => {
            this.$message.success('成功保存')
          })
      },
      async run () {
        const allResult = await run(this.fileContent)
        const result = _.last(allResult).result
        this.$message.success(JSON.stringify(result))
      },
      addNew () {
        this.$prompt('请输入文件名(无需后缀名,已存在文件会覆盖)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          fs.writeFile(this.$store.state.AppInfo.workflowsDir + '/' + value + '.json', JSON.stringify({}),
            'utf-8', (x) => {
              this.$message.success('新建成功')
              this.loadFolder()
            })
        }).catch(() => {
        })
      },
      itemAdd () {
        if (!_.isArray(this.fileContent.steps)) {
          // this.fileContent.steps = []
          this.$set(this.fileContent, 'steps', [])
        }
        this.fileContent.steps.push({name: '步骤', params: {}})
        console.log(this.fileContent)
      },
      itemDelete () {
        _.pull(this.fileContent.steps, this.selection)
        this.fileContent.steps = JSON.parse(JSON.stringify(this.fileContent.steps))
      },
      itemMoveUp () {
        let index = _.findIndex(this.fileContent.steps, this.selection)
        if (index !== -1 && index - 1 >= 0) {
          const temp = this.fileContent.steps[index]
          this.fileContent.steps[index] = this.fileContent.steps[--index]
          this.fileContent.steps[index] = temp
          this.fileContent.steps = JSON.parse(JSON.stringify(this.fileContent.steps))
        }
      },
      itemMoveDown () {
        let index = _.findIndex(this.fileContent.steps, this.selection)
        if (index !== -1 && index + 1 < this.fileContent.steps.length) {
          const temp = this.fileContent.steps[index]
          this.fileContent.steps[index] = this.fileContent.steps[++index]
          this.fileContent.steps[index] = temp
          this.fileContent.steps = JSON.parse(JSON.stringify(this.fileContent.steps))
        }
      }
    },
    watch: {
      filterText (val) {
        this.$refs.treebar.filter(val)
      }
    }
  }
</script>

<style scoped>
</style>