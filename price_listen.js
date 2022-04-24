const fetch = require('node-fetch')

fetch("https://www.caofange.com/api/rest/shop/getShopList", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json;charset=UTF-8;text/plain;",
    "platform": "1",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "token": "MzAyOTVkMDk3MjEyNDk3NDg5ZjY1ZDNjNjJiMjQ3NTcsMTY1MDQyMzkwMDY3MA==",
    "cookie": "CfgGlobal-Token=MzAyOTVkMDk3MjEyNDk3NDg5ZjY1ZDNjNjJiMjQ3NTcsMTY1MDQyMzkwMDY3MA=="
  },
  "referrer": "https://www.caofange.com/search?searchType=1&searchKey=%E5%8D%81%E4%BA%8C%E8%8A%B1%E7%A5%9E&t=1650444192917",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "{\"pageNum\":1,\"pageSize\":12,\"keyWord\":\"十二花神\",\"sortType\":1,\"sort\":1}",
  "method": "POST",
  "mode": "cors"
})
  .then(res => res.json())
  .then(res => {
    console.log(res)
    debugger
    for (let i = 0; i < res.data.data.length; i++) {
      const element = res.data.data[i];
      if (element.buyState === 1) {
        const { createTime, productName, price } = element
        const msg = `时间：${createTime}, ${productName}，现在最低价是${price}`
        sendMessage(msg)
        break;
      }
    }
  })

function sendMessage(msg) {
  debugger
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
    "referrer": "https://wxpusher.zjiecode.com/admin/main/message/send?topicId=4699",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": `{\"appId\":20020,\"uids\":[],\"topicIds\":[\"4699\"],\"url\":\"https://item.taobao.com/item.htm?id=12345sd678\",\"content\":"${msg}",\"contentType\":1}`,
    "method": "POST",
    "mode": "cors"
  })
    .then(res => res.json())
    .then(res => {
      debugger
      console.log(res);
    })
}