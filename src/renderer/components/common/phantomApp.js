// import cheerio from 'cheerio'
import _ from 'lodash'
const phantom = require('phantom')
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36`
const viewPortSize = {
  width: 1920,
  height: 1080
}
let instance = null
let pages = []

async function init () {
  if (pages.length > 0) {
    for (const page of pages) {
      await page.close()
    }
    pages = []
    await exit()
  }
  instance = await phantom.create(['--disk-cache=true'])
  await createPage()
}

async function createPage () {
  const page = await instance.createPage()
  await page.setting('userAgent', userAgent)
  await page.setting('resourceTimeout', 5000)
  await page.property('viewportSize', viewPortSize)
  pages.push(page)
  return { page: page, index: pages.length - 1 }
}

async function exit () {
  await closePageAll()
  await instance.exit()
}

async function open (url, index = 0) {
  await pages[index].open(url)
}

async function stop (index = 0) {
  await pages[index].stop()
}

async function reload (index = 0) {
  await pages[index].reload()
}

function renderBase64 (index = 0) {
  return pages[index].renderBase64('JPEG')
}

function renderFile (path, index = 0) {
  return pages[index].render(path, 'JPEG')
}

function exec (func, index = 0) {
  return pages[index].evaluate(func)
}

function execCode (str, index = 0) {
  return pages[index].evaluateJavaScript(str)
}

function getPage (index = 0) {
  return pages[index]
}

function getPages () {
  return pages
}

async function closePage (index = 0) {
  await pages[index].close()
  _.pullAt(pages, index)
}

async function closePageAll () {
  if (pages.length > 0) {
    for (const page of pages) {
      await page.close()
    }
    pages = []
  }
}

function delay (second) {
  return new Promise((resolve) => {
    setTimeout(resolve, second * 1000)
  })
}

export default {init, createPage, exit, open, stop, reload, renderBase64, renderFile, exec, execCode, getPage, getPages, closePage, closePageAll, delay}
