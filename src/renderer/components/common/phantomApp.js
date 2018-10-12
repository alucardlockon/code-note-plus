// import cheerio from 'cheerio'
// import _ from 'lodash'
const phantom = require('phantom')
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`
const viewPortSize = {
  width: 1920,
  height: 1080
}
let instance = null
let page = null

async function init () {
  instance = await phantom.create()
  page = await instance.createPage()
  await page.setting('userAgent', userAgent)
  await page.property('viewportSize', viewPortSize)
}

async function exit () {
  await instance.exit()
}

async function open (url) {
  await page.open(url)
}

function renderBase64 () {
  return page.renderBase64('JPEG')
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

export default {init, exit, open, renderBase64, execCode, getPage, delay}
