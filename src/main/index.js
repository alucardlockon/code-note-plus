'use strict'

import { app, BrowserWindow, TouchBar, systemPreferences } from 'electron'
import fs from 'fs'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    width: 1300,
    backgroundColor: systemPreferences.isDarkMode() ? '#323232' : '#eeeeee',
    titleBarStyle: 'hiddenInset',
    frame: false,
    resizable: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('ready', () => {
  // 初始化文件夹
  const workflowDir = path.join(app.getPath('userData'), '/workflows')
  if (!fsExistsSync(workflowDir)) {
    fs.mkdir(workflowDir)
  }

  // 初始化touchbar
  const {TouchBarButton} = TouchBar

  const touchBar = new TouchBar([
    new TouchBarButton({
      label: '工作流',
      click: changeTab,
      tabName: 'workflow'
    }),
    new TouchBarButton({
      label: '笔记',
      click: changeTab,
      tabName: 'note'
    }),
    new TouchBarButton({
      label: 'Web应用',
      click: changeTab,
      tabName: 'webapp'
    }),
    new TouchBarButton({
      label: 'API文档',
      click: changeTab,
      tabName: 'apidoc'
    }),
    new TouchBarButton({
      label: '代码片段',
      click: changeTab,
      tabName: 'snippets'
    }),
    new TouchBarButton({
      label: '设置',
      click: changeTab,
      tabName: 'config'
    })
  ])

  mainWindow.setTouchBar(touchBar)

  // 判断系统是否darkmode(mac)
  if (systemPreferences.isDarkMode()) {
  }
})

function fsExistsSync (path) {
  try {
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}

function changeTab () {
  mainWindow.webContents.send('change-tab', this.tabName)
}
