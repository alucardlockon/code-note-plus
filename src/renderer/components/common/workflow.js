import {query as mysqlQuery} from './mysql'
import {request as requestRequest} from './request'

export async function run (content) {
  if (!content || content.steps.length === 0) return false
  let preResult = {}
  let allResult = []
  let stepCount = 1
  for (const step of content.steps) {
    if (step.type === 'mysql') {
      preResult = await runMysql(step, preResult, allResult)
    } else if (step.type === 'gen-code') {
      preResult = await runGenCode(step, preResult, allResult)
    } else if (step.type === 'javascript') {
      preResult = await runJavascript(step, preResult, allResult)
    } else if (step.type === 'variable') {
      preResult = await runVariable(step, preResult, allResult)
    } else if (step.type === 'request') {
      preResult = await runRequest(step, preResult, allResult)
    }
    allResult.push({stepCount: stepCount++, result: preResult})
  }
  console.log(stepCount, allResult)
  return allResult
}

function runMysql (step, preResult, allResult) {
  return new Promise(resolve => {
    mysqlQuery(step.params, (result, fileds) => {
      resolve({ results: result, fileds: fileds })
    })
  })
}

function runGenCode (step, preResult, allResult) {
  return new Promise(resolve => {
    let template = step.params.template
    let parts = template.split('@@')
    let index = 0
    let result = 'let result =``;\n'
    result += 'let preResult = JSON.parse(`' + JSON.stringify(preResult) + '`);'
    for (const part of parts) {
      if (index % 2 === 0) {
        result += 'result+=`' + part + '`;'
      } else {
        if (part.indexOf('{') === 0 && part.indexOf('}') === part.length - 1) {
          result += 'result+=' + part.slice(1, -1) + ';'
        } else {
          result += part
        }
      }
      result += '\n'
      index++
    }
    console.log(result)
    // eslint-disable-next-line no-eval
    resolve(eval(result))
  })
}

function runJavascript (step, preResult, allResult) {
  return new Promise(resolve => {
    let result = 'let result =``;\n'
    result += 'let preResult = JSON.parse(`' + JSON.stringify(preResult) + '`);'
    result += step.params.code
    console.log(result)
    // eslint-disable-next-line no-eval
    resolve(eval(result))
  })
}

function runVariable (step, preResult, allResult) {
  return new Promise(resolve => {
    let result = {}
    result[step.params.name] = step.params.value
    resolve(result)
  })
}

function runRequest (step, preResult, allResult) {
  return new Promise(resolve => {
    let param = JSON.parse('{' + step.params.param + '}')
    requestRequest(step.params.url, step.params.method, param).then(r => {
      resolve(r.data)
    })
  })
}
