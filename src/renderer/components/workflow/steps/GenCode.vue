<template>
    <el-form>
        <el-form-item label="模板">
            <el-input v-model="params.template" type="textarea" :rows="10"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
  export default {
    name: 'step-gen-code',
    props: {
      params: {
        type: Object
      }
    }
  }
</script>

<style scoped>

</style>