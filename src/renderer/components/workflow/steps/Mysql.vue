<template>
    <el-form>
        <el-form-item label="主机">
            <el-input v-model="params.host"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
            <el-input v-model="params.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="params.password"></el-input>
        </el-form-item>
        <el-form-item label="数据库">
            <el-input v-model="params.database"></el-input>
        </el-form-item>
        <el-form-item label="执行语句">
            <el-input v-model="params.sql"></el-input>
        </el-form-item>
        <el-button @click="testConnection">测试连接</el-button>
        <el-button @click="query">预览</el-button>
    </el-form>
</template>

<script>
  import {testConnection, query} from '../../common/mysql'
  export default {
    name: 'step-mysql',
    created () {
      /*
      if (this.$route.params.config) {
        this.config = this.$route.params.config
      }
      */
      // this.params = this.params ? this.params : {}
    },
    props: {
      params: {
        type: Object
      }
    },
    methods: {
      testConnection: function () {
        testConnection(this.params, error => {
          if (!error) {
            this.$message.success('连接成功')
          } else {
            this.$message.error('连接失败:' + error)
          }
        })
      },
      query: function () {
        query(this.params, (result, fields, error) => {
          if (error) {
            this.$message.error('连接失败:' + error)
            return
          }
          this.$message.success('共查询到' + result.length + '条数据')
          console.log(result, fields)
        })
      }
    }
  }
</script>

<style scoped>

</style>