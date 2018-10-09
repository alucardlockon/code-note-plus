<template>
    <el-form>
        <el-form-item label="变量名">
            <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="变量值">
            <el-input v-model="params.value"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
  export default {
    name: 'step-variable',
    created () {
    },
    props: {
      params: {
        type: Object
      }
    }
  }
</script>

<style scoped>

</style>