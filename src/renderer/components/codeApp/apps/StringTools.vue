<template>
   <div>
      字符串:
      <el-input v-model="stringParam"></el-input>
      处理方式:
      <el-input></el-input>
      结果:
      <el-input v-model="stringResult"></el-input>
   </div>
</template>

<script>
    export default {
      name: 'app-string-tools',
      data: function () {
        return {
          stringParam: '',
          stringResult: ''
        }
      }
    }
</script>

<style scoped>

</style>