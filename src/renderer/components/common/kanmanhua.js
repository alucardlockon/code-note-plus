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
  return new Promise(async resolve => {
    const pageUrl = baseUrl + manga.url
    let result = []
    await axios.get(pageUrl)
      .then(async function (res) {
        if (res.data) {
          const $ = cheerio.load(res.data)
          const rawList = $('.chapter-list ul li a')
          result = _.map(rawList, async x => {
            /*
              phantom.getPage().on('onResourceReceived', async response => {
                if (response && response.contentType && response.contentType.indexOf('image/jpeg') >= 0) {
                  await phantom.open(response.url)
                  await phantom.delay(10)
                  // console.log(await phantom.getPage().property('content'))
                  resolve(phantom.renderBase64())
                }
              })
              */
            await phantom.open(baseUrl + x.attribs.href)
            const img = await phantom.exec(() => {
              var img = document.getElementById('mangaFile')
              var getTop = function getTop (e) {
                var offset = e.offsetTop
                if (e.offsetParent != null) {
                  offset += getTop(e.offsetParent)
                }
                return offset
              }
              var getLeft = function getLeft (e) {
                var offset = e.offsetLeft
                if (e.offsetParent != null) {
                  offset += getLeft(e.offsetParent)
                }
                return offset
              }
              img.trueTop = getTop(img)
              img.trueLeft = getLeft(img)
              return img
            })
            phantom.getPage().property('clipRect', {
              top: img.trueTop,
              left: img.trueLeft,
              width: img.width,
              height: img.height
            })
            phantom.renderFile(folder + '/' + (page++) + '.jpg')
            return phantom.renderBase64()
            // await phantom.delay(10)
            /*
              const img = await phantom.exec(() => {
                var img = document.getElementById('mangaFile')
                var canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                var ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, img.width, img.height)
                var dataURL = canvas.toDataURL('image/png')
                // return dataURL.replace("data:image/png;base64,", "")
                return dataURL
              })
              console.log(img)
              return img
              */
            /*
              const content = await phantom.getPage().property('content')
              const $2 = cheerio.load(content)
              const rawList2 = $2('#mangaFile')
              _.forEach(rawList2, async x => {
              })
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
          resolve(result)
        }
      })
  })
}

export function downloadFile (uri, filename, callback) {
  const stream = remote.require('fs').createWriteStream(filename)
  remote.require('request')(uri).pipe(stream).on('close', callback)
}

export function getBase64Image (img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var dataURL = canvas.toDataURL('image/png')
  // return dataURL.replace("data:image/png;base64,", "")
  return dataURL
}
