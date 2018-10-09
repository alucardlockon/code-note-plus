<template>
    <el-form>
        <el-form-item label="URL">
            <el-input v-model="params.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
            <el-select v-model="params.method">
                <el-option label="POST" value="post"></el-option>
                <el-option label="Get" value="get"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="参数">
            <el-input v-model="params.param" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-button @click="testRequest">测试</el-button>
    </el-form>
</template>

<script>
  import {request} from '../../common/request'
  export default {
    name: 'step-request',
    created () {
    },
    props: {
      params: {
        type: Object
      }
    },
    methods: {
      testRequest () {
        request(this.params.url, this.params.method, JSON.parse('{' + this.params.param + '}')).then(r => {
          console.log(r.data)
          this.$message.success(JSON.stringify(r.data))
        })
      }
    }
  }
</script>

<style scoped>

</style>