// 能发送ajax请求的函数模块
// 函数的返回值是promise对象
import axios from 'axios'
export default function ajax(url, data = {}, type = 'GET') {
    if (type === 'GET') {
        let str = ''
        Object.keys(data).forEach((key) => {
            str = str + key + "=" + data[key] + "&"
        })
        if (str) {
            str = "?" + str.substring(0, str.length - 1)
        }
        return axios.get('/api' + url + str)
        // return axios.get('http://localhost:3003' + url + str)
    } else {
        return axios.post('/api' + url, data)
        // return axios.post('http://localhost:3003' + url, data)
    }

}