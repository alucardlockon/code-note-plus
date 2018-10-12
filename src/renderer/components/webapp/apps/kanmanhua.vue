<template>
    <div>
        <div>
         看漫画APP，仅供学习参考使用! <br/>
            <img :src="src" v-show="this.src!==''" width="125px" height="200px">
        </div>
        <el-row>
            <el-col :span="8" v-for="manga in mangaList" :key="manga.url" style="height:260px">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="manga.imageUrl" class="image">
                    <div style="padding: 14px;">
                        <span>{{manga.title}}</span>
                        <div class="bottom clearfix">
                            <el-button type="text" class="button" @click="download(manga)">下载</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import { init, exit, getMangaList, download } from '../../common/kanmanhua'
  export default {
    name: 'app-kanmanhua',
    data () {
      return {
        mangaList: [],
        src: ''
      }
    },
    async created () {
      this.getList()
      await init()
    },
    async destroyed () {
      await exit()
    },
    methods: {
      async getList () {
        this.mangaList = await getMangaList()
      },
      async download (manga) {
        const b = await download(manga, this.$store.state.AppInfo.userDataDir + '/webapp')
        const head = 'data:image/jpeg;base64,'
        if (b.length > 0) {
          this.src = head + b[0]
        }
      }
    }
  }
</script>

<style scoped>

</style>