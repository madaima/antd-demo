const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

let beforeTr1 = ''
const url = 'http://39.105.216.27/showhand/neymar'

setInterval(() => {
  main()

}, 3000)

function main() {
  return axios.get(url)

    .then((res) => {
      console.log(res.data)
      if (res.data) {
        const $ = cheerio.load(res.data)
        const data = $('.table').html()
        debugger

        const keyName = url

        const tr1 = $('tbody')?.find('tr')?.find('td')?.innerHTML || ''
        console.log(tr1);
        debugger
        if (beforeTr1 !== tr1) {
          sendMessage(tr1 + "快去付款")

        } else {
        }

        function sendMessage(msg) {
          console.log('发送', msg);
          fetch("https://wxpusher.zjiecode.com/api/manager/message/send", {
            "headers": {
              "accept": "*/*",
              "accept-language": "zh-CN,zh;q=0.9",
              "content-type": "application/json;charset=utf-8",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "token": "ecee20c947d33a8d248cefacde231d76"
            },
            "referrer": url.replace('neymar', 'CR7'),
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": `{"appId":20020,"topicIds":["4699"],"content":"${msg ? msg : '无'}","contentType":1, "url": "${url.replace('neymar', 'CR7')}"}`,
            "method": "POST",
            "mode": "cors"
          })
            .then(res => res.json())
            .then(res => {
              console.log(res);
              beforeTr1 = tr1
            })
        }
        // fs.writeFileSync('./test.html', data)
      }
    })
}



