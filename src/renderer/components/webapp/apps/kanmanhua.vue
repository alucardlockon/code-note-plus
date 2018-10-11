<template>
    <div>
        <div>
         看漫画APP，仅供学习参考使用!
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
  import { getMangaList, download } from '../../common/kanmanhua'
  export default {
    name: 'app-kanmanhua',
    data () {
      return {
        mangaList: []
      }
    },
    created () {
      this.getList()
    },
    methods: {
      async getList () {
        this.mangaList = await getMangaList()
      },
      async download (manga) {
        await download(manga, this.$store.state.AppInfo.userDataDir + '/webapp')
      }
    }
  }
</script>

<style scoped>

</style>