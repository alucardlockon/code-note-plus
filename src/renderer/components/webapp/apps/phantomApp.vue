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
  import phantom from '../../common/phantomApp'
  export default {
    name: 'app-phantom-app',
    data () {
      return {
        url: 'https://www.baidu.com',
        src: '',
        code: `function(){

}`
      }
    },
    async created () {
      await phantom.init()
      console.log('init phantom')
    },
    destroyed () {
      phantom.exit()
      console.log('exit phantom')
    },
    methods: {
      renderImg: async function () {
        const head = 'data:image/jpeg;base64,'
        const img = await phantom.renderBase64()
        this.src = head + img
      },
      openUrl: async function () {
        await phantom.open(this.url)
        this.renderImg()
      },
      execCode: async function () {
        await phantom.execCode(this.code)
        this.renderImg()
      },
      reload: async function () {
        await phantom.reload()
      }
    }
  }
</script>

<style scoped>

</style>