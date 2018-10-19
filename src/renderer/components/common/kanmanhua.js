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

export async function createPage () {
  return phantom.createPage()
}

export async function closePage (index = 0) {
  return phantom.closePage(index)
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

    await phantom.closePageAll()
    let pageIndexs = []
    for (let i = 0; i < 10; i++) {
      const pageObj = await createPage()
      const pageIndex = pageObj.index
      pageIndexs.push(pageIndex)
    }

    let methods = []
    for (let page = 1; page <= chapter.pageCount; page++) {
      if (page % 10 === 1) {
        methods = []
        for (const pageIndex of pageIndexs) {
          if (page + pageIndex <= chapter.pageCount) {
            methods.push(new Promise(async resolve => {
              await downImg(page + pageIndex, chapterFolder, chapter.url, result, chapter.pageCount, progress, pageIndex, 0)
              resolve()
            }))
          }
        }
        await Promise.all(methods)
      }
    }
    // to zip
    if (fs.existsSync(folder + '/' + manga.title + '_' + chapter.name + '.zip')) {
      fs.unlinkSync(folder + '/' + manga.title + '_' + chapter.name + '.zip')
    }
    const output = fs.createWriteStream(folder + '/' + manga.title + '_' + chapter.name + '.zip')
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })
    archive.pipe(output)
    archive.directory(chapterFolder, false)
    archive.finalize()
    console.log('finish all images')
    resolve(result)
  })
}

export async function downImg (page, folder, chapterUrl, result, totalPage, progress, pageIndex = 0, retryCount = 0) {
  return new Promise(async (resolve, reject) => {
    console.log('start page ' + page + ' page index is ' + pageIndex)
    if (page > totalPage) {
      resolve(null)
      return
    }
    phantom.open('about:blank', pageIndex)
    await phantom.open(baseUrl + chapterUrl + '#p=' + page, pageIndex)
    // console.log('open url: ' + (baseUrl + chapterUrl + '#p=' + page))
    if (retryCount > 0) {
      await phantom.delay(retryCount * 2)
    }
    const img = await phantom.exec(() => {
      try {
        const img = document.getElementById('mangaFile')
        const getTop = function getTop (e) {
          let offset = e.offsetTop
          if (e.offsetParent != null) {
            offset += getTop(e.offsetParent)
          }
          return offset
        }
        const getLeft = function getLeft (e) {
          let offset = e.offsetLeft
          if (e.offsetParent != null) {
            offset += getLeft(e.offsetParent)
          }
          return offset
        }
        img.trueTop = getTop(img)
        img.trueLeft = getLeft(img)
        return img
      } catch (e) {
        console.log('exec code error:' + e)
        return null
      }
    }, pageIndex)
    // console.log('executed script page ' + page)
    if (img === null || img.height <= 100 || (img.height >= 1080 && img.width === 1920) || !img.height || !img.width) {
      if (retryCount < 5) {
        console.log('[error]page ' + page + ' fail,retrying,retry count is ' + retryCount + ' , imgObj:', img)
        retryCount++
        await downImg(page, folder, chapterUrl, result, totalPage, progress, pageIndex, retryCount)
        resolve(null)
      } else {
        console.error('tryed ' + retryCount + ' times, but failed')
        reject(new Error('tryed ' + retryCount + ' times, but failed'))
      }
      return
    }
    // console.log('page ' + page + ',' + img.height + ',' + img.width)
    phantom.getPage(pageIndex).property('clipRect', {
      top: img.trueTop,
      left: img.trueLeft,
      width: img.width,
      height: img.height
    })
    // console.log('begin rendering file for page ' + page)
    await phantom.renderFile(folder + '/' + page + '.jpg', pageIndex)
    // console.log('begin render base64 for page ' + page)
    result.push(await phantom.renderBase64(pageIndex))
    // console.log('page ' + page + ' completed, page index is ' + pageIndex)
    progress.progress++
    retryCount = 0
    resolve(phantom.renderBase64(pageIndex))
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
