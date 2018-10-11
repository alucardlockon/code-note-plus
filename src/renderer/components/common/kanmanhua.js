import axios from 'axios'
import cheerio from 'cheerio'
import _ from 'lodash'
import {remote} from 'electron'
const phantom = require('phantom')

const baseUrl = 'https://www.manhuagui.com'

export async function getMangaList () {
  const pageUrl = baseUrl + '/list/'
  let result = []
  await axios.get(pageUrl)
    .then(res => {
      if (res.data) {
        const $ = cheerio.load(res.data)
        const rawList = $('#contList li a[class="bcover"]')
        result = _.map(rawList, x => {
          return { title: x.attribs.title, url: x.attribs.href, imageUrl: x.children[0].attribs.src }
        })
      }
    })
  return result
}

export async function download (manga, folder) {
  const pageUrl = baseUrl + manga.url
  let result = []
  await axios.get(pageUrl)
    .then(async function (res) {
      if (res.data) {
        const $ = cheerio.load(res.data)
        const rawList = $('.chapter-list ul li a')
        result = _.forEach(rawList, async x => {
          const instance = await phantom.create()
          const page = await instance.createPage()
          const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`
          page.setting('userAgent', userAgent)
          await page.open(baseUrl + x.attribs.href)
          const content = await page.property('content')
          const $2 = cheerio.load(content)
          const rawList2 = $2('#mangaFile')
          _.forEach(rawList2, x => {
            const dlUrl = x.attribs.src.replace(/.jpg/, '.jpg.webp')
            axios.get(encodeURI(dlUrl)).then(res => console.log(res))
            console.log(dlUrl)
            downloadFile(dlUrl, folder + '/abc.jpg', () => {
              console.log('下载完毕')
            })
          })
          instance.exit()
          // console.log(content)
        })
      }
    })
  return result
}

export function downloadFile (uri, filename, callback) {
  const stream = remote.require('fs').createWriteStream(filename)
  remote.require('request')(uri).pipe(stream).on('close', callback)
}
