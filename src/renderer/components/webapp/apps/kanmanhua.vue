<template>
    <div>
        <div>
         看漫画APP，仅供学习参考使用! <br/>
            <img :src="src" v-show="this.src!==''" width="125px" height="200px">
        </div>
        <el-row>
            <el-input v-model="keyword" style="width: 350px"></el-input>
            <el-button type="primary" style="width: 80px" @click="search">查找</el-button>
            <el-button type="primary" style="width: 80px" @click="getList">重置</el-button>
        </el-row>
        <el-row>
            <el-col :span="8" v-for="manga in mangaList" :key="manga.url" style="height:260px">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="manga.imageUrl" class="image">
                    <div style="padding: 14px;">
                        <span>{{manga.title}}</span>
                        <div class="bottom clearfix">
                            <el-button type="text" class="button" @click="chapter(manga)">章节</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
                :title="selectedManga.title + '章节列表'"
                :visible.sync="dialogVisible"
                width="30%">
            点击章节名下载: <br />
            <span v-for="chapter in chapterList" :key="chapter.url">
                <el-button type="text" class="button" @click="download(selectedManga, chapter)">{{chapter.name}}({{chapter.pageCount}}p)</el-button>
            </span>
            <div v-if="downloading">
                正在下载中: {{progress.progress+'/'+progress.max}} <br/>
                <el-progress :percentage="Math.round(progress.progress/progress.max*100)" text-inside show-text status="success" :stroke-width="18"></el-progress>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import { init, exit, getMangaList, download, search, getChapterList } from '../../common/kanmanhua'
  // import pinyin from 'pinyin'
  export default {
    name: 'app-kanmanhua',
    data () {
      return {
        mangaList: [],
        src: '',
        keyword: '',
        dialogVisible: false,
        selectedManga: {},
        chapterList: [],
        downloading: false,
        progress: {progress: 0, max: 10}
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
      async download (manga, chapter) {
        this.downloading = true
        this.progress.progress = 0
        this.progress.max = chapter.pageCount
        await download(manga, chapter
          //, this.$store.state.AppInfo.userDataDir + '/webapp/kanmanhua/' + (pinyin(manga.title, {style: pinyin.STYLE_NORMAL}) + '').replace(/,/g, '_')
          , this.$store.state.AppInfo.userDataDir + '/webapp/kanmanhua/' + manga.title.replace(/\s+/g, '_')
          , this.progress)
        /*
        const head = 'data:image/jpeg;base64,'
        if (b.length > 0) {
          this.src = head + b[0]
        }
        */
        this.downloading = false
      },
      async search () {
        this.mangaList = await search(this.keyword)
      },
      async chapter (manga) {
        this.selectedManga = manga
        this.dialogVisible = true
        this.chapterList = await getChapterList(manga)
      }
    }
  }
</script>

<style scoped>

</style>