// import cheerio from 'cheerio'
// import _ from 'lodash'
const phantom = require('phantom')
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36`
const viewPortSize = {
  width: 1920,
  height: 1080
}
let instance = null
let page = null

async function init () {
  instance = await phantom.create(['--disk-cache=true'])
  page = await instance.createPage()
  await page.setting('userAgent', userAgent)
  await page.setting('resourceTimeout', 5000)
  await page.property('viewportSize', viewPortSize)
}

async function exit () {
  await instance.exit()
}

async function open (url) {
  await page.open(url)
}

async function stop () {
  await page.stop()
}

async function reload () {
  await page.reload()
}

function renderBase64 () {
  return page.renderBase64('JPEG')
}

function renderFile (path) {
  return page.render(path, 'JPEG')
}

function exec (func) {
  return page.evaluate(func)
}

function execCode (str) {
  return page.evaluateJavaScript(str)
}

function getPage () {
  return page
}

function delay (second) {
  return new Promise((resolve) => {
    setTimeout(resolve, second * 1000)
  })
}

export default {init, exit, open, stop, reload, renderBase64, renderFile, exec, execCode, getPage, delay}
