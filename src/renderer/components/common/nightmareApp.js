import Nightmare from 'nightmare'
import {exec} from 'child_process'

let nightmare = null
let workerProcess

export function init () {
  nightmare = new Nightmare({
    show: true,
    openDevTools: {
      mode: 'detach'
    }
  })
}

export function test (path) {
  workerProcess = exec('node nightmare.js', {cwd: path})
  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data)
  })
  workerProcess.stderr.on('data', function (data) {
    console.error('stderr: ' + data)
  })
  workerProcess.on('close', function (code) {
    console.log('out code：' + code)
  })
}

export function test2 () {
  nightmare
    .goto('https://duckduckgo.com')
    .type('#search_form_input_homepage', 'github nightmare')
    .click('#search_button_homepage')
    .wait('#r1-0 a.result__a')
    .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
    .end()
    .then(result => {
      console.log(result)
    })
}
