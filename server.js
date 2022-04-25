const express = require('express')
const axios = require('axios')
const app = express()
const circularJson = require('circular-json')
const port = '2451'



// http.listen(proxyPort, () => {
//   console.log(`Proxy server listening on port ${proxyPort}`)
// })


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

// // app.get('/', (req, res) => {

// //   res.json({req, res})
// // })


app.post('/', function (req, res) {
  debugger
  axios({
    ...req.body.proxyData
  })
    .then((response) => {
      debugger
      res.end(circularJson.stringify(response))
      // if (response.headers.authorization) {
      //   debugger
      //   res.json({
      //     authorization: response.headers.authorization,
      //     ...response.data
      //   })
      // } else {
      //   debugger
      //   res.json(response.data)
      // }
    })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})