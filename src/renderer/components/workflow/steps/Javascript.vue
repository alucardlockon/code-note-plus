<template>
    <el-form>
        <el-form-item label="代码">
            <el-input v-model="params.code" type="textarea" :rows="10"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
  export default {
    name: 'step-javascript',
    props: {
      params: {
        type: Object
      }
    }
  }
</script>

<style scoped>

</style>