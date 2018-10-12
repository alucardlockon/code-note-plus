import axios from 'axios'
import cheerio from 'cheerio'
import _ from 'lodash'
import {remote} from 'electron'
import phantom from './phantomApp'

const baseUrl = 'https://www.manhuagui.com'

export async function init () {
  await phantom.init()
}

export async function exit () {
  await phantom.exit()
}

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
          await phantom.open(baseUrl + x.attribs.href)
          // await phantom.delay(10)
          const content = await phantom.getPage().property('content')
          let images = []
          phantom.getPage().on('onResourceReceived', function (response) {
            images.push(response)
          })
          phantom.delay(5)
          console.log(images)
          const $2 = cheerio.load(content)
          const rawList2 = $2('#mangaFile')
          _.forEach(rawList2, x => {
          })
          /*
          _.forEach(rawList2, x => {
            const dlUrl = x.attribs.src.replace(/.jpg/, '.jpg.webp')
            axios.get(dlUrl).then(res => console.log(res))
            console.log(dlUrl)
            downloadFile(dlUrl, folder + '/abc.jpg', () => {
              console.log('下载完毕')
            })
          })
          */
        })
      }
    })
  return result
}

export function downloadFile (uri, filename, callback) {
  const stream = remote.require('fs').createWriteStream(filename)
  remote.require('request')(uri).pipe(stream).on('close', callback)
}
