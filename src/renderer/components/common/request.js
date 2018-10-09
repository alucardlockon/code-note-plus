import axios from 'axios'

export function request (url, method, param) {
  if (method === 'get') {
    return axios.get(url, { params: param })
  } else {
    axios({
      method: method,
      url: url,
      data: param
    })
  }
}
