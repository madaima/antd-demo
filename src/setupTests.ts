// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
//在node环境下使用cheerio来解析html

const keyName = window.location.href

const beforeTr1 = window.localStorage.getItem(keyName);
const log = window.localStorage.getItem('log') || '';

if(log) {
  console.log(JSON.parse(log));
}

const tr1 = document.querySelector('tbody')?.querySelector('tr')?.querySelector('td')?.innerHTML || ''
console.log(tr1);
if (beforeTr1 !== tr1) {
  sendMessage(tr1 + "快去付款")
  
} else {
  setTimeout(() => {
    window.location.reload()
  }, 5000)
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
    "referrer": window.location.href.replace('neymar', 'CR7'),
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": `{"appId":20020,"topicIds":["4699"],"content":"${msg ? msg : '无'}","contentType":1, "url": "${window.location.href.replace('neymar', 'CR7')}"}`,
    "method": "POST",
    "mode": "cors"
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    window.localStorage.setItem('log', JSON.stringify(res));
    window.localStorage.setItem(keyName, tr1)
    window.location.reload()
  })
}

