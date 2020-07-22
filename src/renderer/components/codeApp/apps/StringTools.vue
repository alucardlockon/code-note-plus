<template>
   <div>
      字符串(a):
      <el-input v-model="stringParam"></el-input>
      处理方式(js代码,like a.split(',')):
      <el-input v-model="code"></el-input>
      结果(r):
      <el-input :value="stringResult"></el-input>
   </div>
</template>

<script>
    export default {
      name: 'app-string-tools',
      data: function () {
        return {
          stringParam: '',
          code: ''
        }
      },
      computed: {
        stringResult: function () {
          let result = ''
          if (this.code) {
            try {
              // eslint-disable-next-line no-new-func
              const func = new Function('a', 'return ' + this.code)
              // eslint-disable-next-line no-useless-call
              result = func.apply(null, [this.stringParam])
            } catch (e) {
              result = ''
              console.error(e)
            }
          }
          return result
        }
      }
    }
</script>

<style scoped>

</style>