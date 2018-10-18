import axios from 'axios'
import cheerio from 'cheerio'
import _ from 'lodash'
import {remote} from 'electron'
import phantom from './phantomApp'
import fs from 'fs'
import archiver from 'archiver'
import rimraf from 'rimraf'

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

export async function download (manga, chapter, folder, progress) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
  const chapterFolder = folder + '/' + chapter.name
  if (fs.existsSync(chapterFolder)) {
    rimraf.sync(chapterFolder)
  }
  fs.mkdirSync(chapterFolder)
  return new Promise(async resolve => {
    let result = []
    let page = 1
    await downImg(page, chapterFolder, chapter.url, result, chapter.pageCount, progress)
    // to zip
    const output = fs.createWriteStream(folder + '/' + manga.title + '_' + chapter.name + '.zip')
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })
    archive.pipe(output)
    archive.directory(folder, false)
    archive.finalize()
    console.log('finish all images')
    resolve(result)
  })
}

export async function downImg (page, folder, chapterUrl, result, totalPage, progress) {
  return new Promise(async resolve => {
    console.log('start page ' + page)
    if (page > totalPage) {
      resolve(null)
    }
    phantom.open('about:blank')
    await phantom.open(baseUrl + chapterUrl + '#p=' + page)
    console.log('open url: ' + (baseUrl + chapterUrl + '#p=' + page))
    // await phantom.getPage().reload()
    // console.log('reload page ' + page)
    // await phantom.delay(5)
    // console.log('resume page ' + page)
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
    console.log('executed script page ' + page)
    // retry
    // console.log(img)
    if (img === null) {
      console.log('[error]page ' + page + ' fail,retrying')
      await downImg(page, folder, chapterUrl, result, totalPage, progress)
      resolve(null)
    }
    phantom.getPage().property('clipRect', {
      top: img.trueTop,
      left: img.trueLeft,
      width: img.width,
      height: img.height
    })
    console.log('begin rendering file for page ' + page)
    await phantom.renderFile(folder + '/' + (page++) + '.jpg')
    console.log('begin render base64 fro page ' + page)
    // return phantom.renderBase64()
    result.push(await phantom.renderBase64())
    if (page <= totalPage) {
      console.log('page ' + page + 'completed')
      progress.progress++
      await downImg(page, folder, chapterUrl, result, totalPage, progress)
    }
    console.log('page ' + page + ' end')
    resolve(phantom.renderBase64())
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

export async function search (query) {
  const pageUrl = baseUrl + '/s/' + query + '.html'
  let result = []
  await axios.get(pageUrl)
    .then(res => {
      if (res.data) {
        const $ = cheerio.load(res.data)
        const rawList = $('.book-result ul li a[class="bcover"]')
        result = _.map(rawList, x => {
          return { title: x.attribs.title, url: x.attribs.href, imageUrl: x.children[0].attribs.src }
        })
      }
    })
  return result
}

export async function getChapterList (manga) {
  return new Promise(async resolve => {
    const pageUrl = baseUrl + manga.url
    let result = []
    await axios.get(pageUrl)
      .then(async function (res) {
        if (res.data) {
          const $ = cheerio.load(res.data)
          const rawList = $('.chapter-list ul li a')
          result = _.map(rawList, x => {
            return { name: x.attribs.title, url: x.attribs.href, pageCount: parseInt(x.firstChild.children[1].firstChild.data.slice(0, -1)) }
          })
          resolve(result)
        }
      })
  })
}
