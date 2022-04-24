const axios = require('axios')
axios({
  method: 'post',
  url: 'http://localhost:2451',
  data: {
    proxyData: {
      url: 'https://api.theone.art/auth/api/auth/authCodeLogin',
      data: {
        phone: '13014998134',
        authCode: '123478'
      },
      method: 'post',
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json;charset=UTF-8",
        "referrer": "https://www.theone.art/login",
        "referrerPolicy": "no-referrer-when-downgrade",
        "mode": "cors"
      },
    },
  },
})
.then((res) => {
  const {headers, data} = res.data
  console.log(data)
  console.log(headers)
}).catch((err) => {
  console.log(err)
})