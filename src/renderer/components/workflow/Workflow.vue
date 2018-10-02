<template>
    <el-container>
        <el-aside width="200px">
            <el-row>
                <el-col :xs="24">
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-plus">添加</el-button>
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
                    :data="data2"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="treebar">
            </el-tree>
        </el-aside>
        <el-main>{{path}}</el-main>
    </el-container>
</template>

<script>
  import { remote } from 'electron'
  export default {
    name: 'workflow',
    watch: {
      filterText (val) {
        this.$refs.treebar.filter(val)
      }
    },

    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      }
    },

    data () {
      return {
        path: remote.app.getAppPath('userData'),
        filterText: '',
        data2: [{
          id: 1,
          label: '第一'
        }, {
          id: 2,
          label: '第二'
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  }
</script>

<style scoped>

</style>