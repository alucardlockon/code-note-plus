<template>
    <div>
        <img :src="src" v-show="this.src!==''" width="384px" height="216px">
        <el-input v-model="url" style="width: 350px"></el-input>
        <el-button type="primary" style="width: 80px" @click="openUrl">OPEN</el-button>
        <el-button type="primary" style="width: 100px" @click="renderImg">RENDER</el-button>
        <el-input type="textarea" :rows="3" v-model="code" style="width: 350px"></el-input>
        <el-button type="primary" style="width: 100px" @click="execCode">EXEC</el-button>
        <el-button type="primary" style="width: 100px" @click="reload">RELOAD</el-button>
    </div>
</template>

<script>
  import {test} from '../../common/nightmareApp'
  export default {
    name: 'app-nightmare-app',
    data () {
      return {
        url: 'https://www.baidu.com',
        src: '',
        code: `function(){

}`
      }
    },
    created () {
    },
    destroyed () {
    },
    methods: {
      renderImg: async function () {
      },
      openUrl: function () {
        test(this.$store.state.AppInfo.appPath + '/webApp/script')
      },
      execCode: async function () {
      },
      reload: async function () {
      }
    }
  }
</script>

<style scoped>

</style>