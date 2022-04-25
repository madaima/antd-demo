import { Button, Input, InputRef, Modal, Space, Table } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useRef, useState } from 'react'
import './account-list.less'
import axios from 'axios'


//代理网址 'http://localhost:2451'
const port = '2451'
const proxyUrl = `http://localhost:${port}`

//初始区间值
const defaultDrawIntervalTime = {
  start: '60000',
  end: '80000'
}
export default function AccountList(props, ref, key) {
  interface userToken {
    key: string;
    number: string;
    cookie: {
      authorization?: string;
    };
    log: string;
    logHistory: Array<string>;
  }

  interface IOperationLog {
    time: number;
    log: string;
    user: string;
  }


  const arr1: userToken[] = []
  const [dataSource, setDataSource] = useState(arr1)
  // 验证码弹窗逻辑
  const [isShowCodeModal, setIsShowCodeModal] = useState(false)

  //操作日志 记录所有操作

  const [operationLog, setOperationLog] = useState([] as IOperationLog[])

  const [authCodeModel, contextHolder] = Modal.useModal()

  const [authCode, setAuthCode] = useState('')
  function showCodeModal(number: string) {
    const ref = React.createRef<InputRef>()
    authCodeModel.confirm({
      icon: false,
      content: (
        <div>
          <div>{number}的验证码</div>
          <div className='flex-box' >
            <Input ref={ref} style={{ width: '330px', flex: '1', marginTop: '10px' }}
              // value={authCode}
              onChange={(e) => {
                setAuthCode(e.target.value)
              }
              }
              placeholder="请输入验证码"
            />
          </div>
        </div>
      ),
      onOk() {
        const authCode = ref.current?.input?.value
        if (authCode !== '' && authCode !== undefined) {
          getUserToken(number, authCode)
        }
      },
      onCancel() {
      },
    })
    // setIsShowCodeModal(true)
  }
  useEffect(() => {
    const userToken = getStorage()
    if (userToken) {
      setDataSource(userToken)
    }
  }, [])
  // useEffect(() => {
  //   console.log('在更了在更了')
  // }, [dataSource])
  function getStorage() {
    const userTokenString = localStorage.getItem('userToken')
    if (userTokenString) {
      return JSON.parse(userTokenString)
    }
    return false
  }
  function setStorage(userToken: string) {
    userToken && localStorage.setItem('userToken', userToken)
  }

  function addAccount() {
    setShowModal(true)
  }

  const [textAreaContent, setTextAreaContent] = useState('')

  function handleTextAreaChange(e: any) {
    setTextAreaContent(e.currentTarget.value)
  }

  function closeModal() {
    setShowModal(false)
  }

  function okModal() {
    if (textAreaContent) {
      //正则匹配回车换行
      const reg = /\r\n|\n/g
      const arr = textAreaContent.split(reg)
      //遍历数组，正则匹配手机号码
      for (let i = 0; i < arr.length; i++) {
        const reg = /^1[3-9]\d{9}$/
        //查跟后面是否重复
        const isRepeat = dataSource.some(item => item['number'] === arr[i])
        if (isRepeat) {
          Modal.error({
            title: '提示',
            content: '手机号码重复，重复的号码为：' + arr[i],
          })
          return
        }
        //查跟原来账号是否重复
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            Modal.error({
              title: '提示',
              content: `输入框内账号重复,重复的是${arr[i]}`,
            })
            return
          }
        }
        if (!reg.test(arr[i])) {
          Modal.error({
            title: '手机号码格式错误',
            content: `错误的号码为：${arr[i]}`,
          })
          return
        }
      }

      //遍历数组,赋值
      const accounts = arr.map(item => {
        const userToken = {
          key: item,
          number: item,
          cookie: {},
          log: '',
          logHistory: [],
        }
        return userToken
      })
      //查重复number
      const newAccounts = accounts.filter(item => {
        const isRepeat = dataSource.some(item2 => item2.number === item.number)
        return !isRepeat
      })
      setStorage(JSON.stringify([...dataSource, ...newAccounts]))
      setDataSource([...dataSource, ...newAccounts])
    }
    setTextAreaContent('')
    setShowModal(false)
  }

  const [showModal, setShowModal] = useState(false)
  function login(record: userToken) {
    //登录
    //弹窗输入验证码
    showCodeModal(record.number)
  }

  function getUserToken(number: string, authCode: string) {
    //获取用户token
    // POST https://api.theone.art/auth/api/auth/authCodeLogin HTTP/1.1
    // Host: api.theone.art
    // Connection: keep-alive
    // Content-Length: 43
    // Accept: application/json, text/plain, */*
    // User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36
    // Content-Type: application/json;charset=UTF-8
    // Origin: https://www.theone.art
    // Sec-Fetch-Site: same-site
    // Sec-Fetch-Mode: cors
    // Sec-Fetch-Dest: empty
    // Referer: https://www.theone.art/login?redirect=https%3A%2F%2Fwww.theone.art%2Fmine%2Ftreasure
    // Accept-Encoding: gzip, deflate, br
    // Accept-Language: zh-CN,zh;q=0.9

    //https://api.theone.art/auth/api/auth/authCodeLogin 参数: phone=13336245241,authCode=342154
    //返回cookie authorization: eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzMzNjI0NTI0MSIsImlhdCI6MTY0OTQ3MjI2NiwiZXhwIjoxNjUwMDc3MDY2fQ.w9xE1H7saCI8rNmW91IA9jeyTkvHdidx6NC9nH-jfla4GROOSYthVGnS18-DbAqdbQYSQ1bPBy5W5vNJ2Y5reQ
    console.log(number, authCode)

    axios({
      method: 'post',
      url: proxyUrl,
      data: {
        proxyData: {
          url: 'https://api.theone.art/auth/api/auth/authCodeLogin',
          data: {
            phone: number,
            authCode
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
        const { data, headers } = res.data
        modifyDataSource(dataSource.map((item: userToken) => {
          if (item.number === number) {
            if (headers.authorization) {
              item.cookie = {
                authorization: headers.authorization
              }
            }
            item.log = addDateInfo(data.message)
          }
          return { ...item }//重塑一个对象 使react认为其已经更新
        }))
        console.log(res.data)

      }).catch((err) => {
        console.log(err)
      })

  }

  //获取盲盒列表
  async function getBlindBoxList(record: userToken) {
    const authorization = record.cookie.authorization

    const result = await axios({
      method: 'post',
      url: proxyUrl,
      data: {
        proxyData: {
          url: 'https://api.theone.art/goods/api/treasureSku/listBox',
          data: {
            pageCount: 1,
            pageSize: 8,
            blindBoxDraw: 0
          },
          method: 'post',
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "authorization": authorization,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "referrer": "https://www.theone.art/mine/treasure",
            "referrerPolicy": "no-referrer-when-downgrade",
            "mode": "cors"
          }
        },
      },
    })
      .then((res) => {
        const { data, headers } = res.data
        const { records } = data.data
        const promise = new Promise((resolve, reject) => {
          if (records.length === 0) {
            modifyDataSource(dataSource.map((item: userToken) => {
              if (item.number === record.number) {
                item.log = addDateInfo('没有盲盒可抽')
              }
              return { ...item }//重塑一个对象 使react认为其已经更新
            }))
            resolve('无盲盒')
            return
          }
          records.map((item) => {
            const commodity = item.commodity
            const commodityId = commodity.id
            const treasureSkuId = item.id

            setTimeout(async () => {
              resolve(await drawBlindBox(commodityId, treasureSkuId, authorization, record))
            }, Math.random() * 300 + 1000)
          })
        })
        debugger
        return promise
      }).catch((err) => {
        console.log(err)
      })
    debugger
    return result
  }
  
  //抽签
  async function drawBlindBox(commodityId: string, treasureSkuId: string, authorization, record: userToken) {
    const res = await axios({
      method: 'post',
      url: proxyUrl,
      data: {
        proxyData: {
          url: "https://api.theone.art/goods/api/treasureSku/openBox",
          data: {
            commodityId,
            treasureSkuId
          },
          method: 'post',
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "authorization": authorization,
            "content-type": "application/json;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "referrer": "https://www.theone.art/mine/treasure",
            "referrerPolicy": "no-referrer-when-downgrade",
            "mode": "cors"
          }
        },
      },
    })
      .then((res) => {
        const { data } = res.data
        const { commoditySku } = data.data
        modifyDataSource(dataSource.map((item: userToken) => {
          if (item.number === record.number) {
            item.log = addDateInfo(commoditySku.name)
          }
          return { ...item }
        }))
        console.log(res.data)
        return res
      }).catch((err) => {
        console.log(err)
      })
    debugger
    return res
  }

  function addDateInfo(value: string) {
    const date = new Date()
    //日期时分秒
    // const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    const time = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return time + ' ' + value
  }

  //专门处理日志
  function handleLog(record: userToken, log: string) {
    modifyDataSource(dataSource.map((item: userToken) => {
      if (item.number === record.number) {
        log = addDateInfo(log)
        item.logHistory = item.logHistory ? [...item.logHistory, log] : [log]
        item.log = log
        //写入操作日志
        HandleOperationLog(record, log)
      }
      return { ...item }
    }))
  }


  const [historyLogModal, historyLogModalContextHolder] = Modal.useModal()
  //显示账号对应的历史日志
  function viewHistoryLog(record: userToken) {
    const logHistory = record.logHistory
    if (!logHistory) {
      historyLogModal.error({
        title: '暂无历史日志',
      })
      return
    }
    historyLogModal.confirm({
      title: '历史日志',
      content: (
        <div>
          {logHistory.map((item: string) => {
            return <p>{item}</p>
          }
          )}
        </div>
      )
    })
  }


  useEffect(() => {
    const operationLog = JSON.parse(localStorage.getItem('operationLog') || '[]')
    setOperationLog(operationLog)
  }, [])

  function HandleOperationLog(accountInfo: userToken, log: string) {
    const { number } = accountInfo
    const newOperationLog = [...operationLog, {
      time: new Date().getTime(),
      user: number,
      log,
    }]
    setOperationLog(newOperationLog)
    localStorage.setItem('operationLog', JSON.stringify(newOperationLog))
  }

  const [operationLogModal, operationLogModalContext] = Modal.useModal()
  //查看操作日志
  function viewOperationLog() {

    operationLogModal.confirm({
      title: '操作日志',
      icon: false,
      content: (
        <div>
          <ul>
            {operationLog.map((item: IOperationLog) => {
              return (
                <li key={item.time}>
                  <p>{item.user}</p>
                  <p>{item.log}</p>
                </li>
              )
            }
            )}
          </ul>
        </div>
      ),
    })
  }

  //一键抽奖
  function drawAll() {

  }

  const [isViewDrawResult, setIsViewDrawResult] = useState(false)
  const isViewDrawResultRef = useRef(isViewDrawResult)
  //一键开奖
  function viewDrawResultAll() {
    const selectArray = dataSource.filter((item: userToken) => {
      if (selectedRowKeys.indexOf(item.number) !== -1) {
        return true
      }
      return false
    })
    if (selectArray.length === 0) {
      operationLogModal.error({
        title: '请选择要开奖的账号',
      })
      return
    }
    setIsViewDrawResult(true)
    console.log(isViewDrawResult)
    // let index = 0;
    async function viewDrawResultHandle() {
      const intervalTime = Math.random() * (parseInt(drawInterval.end) - parseInt(drawInterval.start)) + parseInt(drawInterval.start)
      const record = selectArray.shift()
      if (!record) return
      const res = await getBlindBoxList(record)
      if (selectArray.length === 0) {
        setIsViewDrawResult(false)
        operationLogModal.success({
          title: '开奖完成',
        })
        return
      }
      console.log(res)
      setTimeout(() => {
        if (isViewDrawResultRef.current) {
          return
        }
        viewDrawResultHandle()
      }, intervalTime)
    }
    viewDrawResultHandle()
  }

  //停止开奖
  function stopViewDrawResultAll() {
    setIsViewDrawResult(false)
    operationLogModal.success({
      title: '停止开奖',
    })
  }

  function selectAll() {
    setSelectedRowKeys(dataSource.map((item: userToken) => {
      return item.number
    }))
  }

  //选中的方法
  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys)
  }

  //获取藏品列表
  function getTreasureList(record) {
    const authorization = record.cookie.authorization
    axios({
      method: 'post',
      url: 'http://localhost:2451',
      data: {
        proxyData: {
          url: 'https://api.theone.art/goods/api/treasure/list',
          data: {
            pageCount: 1,
            pageSize: 16,
            name: "",
            blindBoxDraw: 0
          },
          method: 'post',
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "authorization": authorization,
            "content-type": "application/json;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "referrer": "https://www.theone.art/mine/treasure",
            "referrerPolicy": "no-referrer-when-downgrade",
            "mode": "cors"
          }
        },
      },
    })
      .then((res) => {
        const { data: {
          data: { records }
        } } = res.data
        if (records.length === 0) {
          //暂无藏品
          handleLog(record, '暂无藏品')
        } else {
          //输出藏品列表
          const names = records.map((item, index) => {
            const commodity = item.commodity
            const { name } = commodity
            return (index + 1) + '.' + name + '\n'
          })
          handleLog(record, names.join(','))
        }

        console.log(res.data)

      }).catch((err) => {
        console.log(err)
      })
    //获取藏品列表
    //请求标头范例
    // POST /goods/api/treasure/list HTTP/1.1
    // Host: api.theone.art
    // Connection: keep-alive
    // Content-Length: 56
    // Accept: application/json, text/plain, */*
    // authorization: eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzMzNjI0NTI0MSIsImlhdCI6MTY0OTQ3MjI2NiwiZXhwIjoxNjUwMDc3MDY2fQ.w9xE1H7saCI8rNmW91IA9jeyTkvHdidx6NC9nH-jfla4GROOSYthVGnS18-DbAqdbQYSQ1bPBy5W5vNJ2Y5reQ
    // User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36
    // Content-Type: application/json;charset=UTF-8
    // Origin: https://www.theone.art
    // Sec-Fetch-Site: same-site
    // Sec-Fetch-Mode: cors
    // Sec-Fetch-Dest: empty
    // Referer: https://www.theone.art/mine/treasure
    // Accept-Encoding: gzip, deflate, br
    // Accept-Language: zh-CN,zh;q=0.9
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([] as string[])


  function modifyDataSource(dataSource) {
    //修改数据源
    setDataSource([...dataSource])
    setStorage(JSON.stringify(dataSource))
  }
  function deleteAccount(record: userToken) {
    //删除账号
    const newDataSource = dataSource.filter(item => item.number !== record.number)
    setStorage(JSON.stringify(newDataSource))
    setDataSource(newDataSource)
  }
  const columns =
    [
      {
        title: '用户名',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '凭证',
        dataIndex: 'cookie',
        key: 'cookie',
        width: 100,
        render(value: object) {
          //判断非空对象
          if (Object.keys(value).length !== 0) {
            //遍历对象
            return (
              <div>
                {
                  Object.keys(value).map(item => {
                    return (
                      <div style={{ width: '100px', height: '40px', overflow: 'hidden' }} key={item}>
                        <span>{item}：</span>
                        <span>{value[item]}</span>
                      </div>
                    )
                  })
                }
              </div>
            )
          } else {
            return <span>未登录</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (value: any, record: userToken) => {
          return (
            <Space size={'middle'}>
              <Button onClick={() => login(record)}>登录</Button>
              <Button onClick={() => deleteAccount(record)} >删除</Button>
              <Button onClick={() => getBlindBoxList(record)} >抽签</Button>
              <Button onClick={() => getTreasureList(record)} >查看</Button>
              <Button onClick={() => viewHistoryLog(record)} >历史</Button>

            </Space>
          )
        }
      },
      {
        title: '日志',
        dataIndex: 'log',
        key: 'log',
      },
    ]
  interface IDrawInterval {
    start: string;
    end: string;
  }

  const [isSelectAll, setIsSelectAll] = useState(false)

  useEffect(() => {
    if (selectedRowKeys.length === dataSource.length) {
      setIsSelectAll(true)
    } else {
      setIsSelectAll(false)
    }
  }, [dataSource.length, selectedRowKeys])

  function unSelectAll() {
    setSelectedRowKeys([])
  }

  const [drawInterval, setDrawInterval] = useState({} as IDrawInterval)

  useEffect(() => {
    const drawIntervalString = localStorage.getItem('drawInterval')
    const drawInterval = drawIntervalString ? JSON.parse(drawIntervalString) : defaultDrawIntervalTime
    setDrawInterval(drawInterval)
  }, [])

  useEffect(() => {
    const drawIntervalString = JSON.stringify(drawInterval)
    localStorage.setItem('drawInterval', drawIntervalString)
  }, [drawInterval])

  // function changeIsViewDrawResult() {
  //   console.log(isViewDrawResult)
  //   setIsViewDrawResult(!isViewDrawResult)
  //   setTimeout(()=> {
  //     console.log(isViewDrawResult)
  //   },1000)
  // }


  return (
    <div>
      <div className='drawIntervalContainer' style={{ textAlign: 'left' }}>
        抽奖间隔
        <Input className='intervalInput' onChange={(e) => {
          const { value } = e.target
          drawInterval.start = value
          setDrawInterval({ ...drawInterval })
        }} value={drawInterval.start} style={{ width: '100px' }}></Input>到
        <Input className='intervalInput' onChange={(e) => {
          const { value } = e.target
          drawInterval.end = value
          setDrawInterval({ ...drawInterval })
        }} value={drawInterval.end} style={{ width: '100px' }}></Input>
        {
          !isViewDrawResult ? <Button style={{ marginRight: '10px' }} onClick={viewDrawResultAll} >一键开奖</Button> : <Button style={{ marginRight: '10px' }} onClick={stopViewDrawResultAll} >停止开奖</Button>
        }
        <Button style={{ marginRight: '10px' }} onClick={drawAll} >一键抽奖</Button>
        {
          !isSelectAll ? <Button onClick={selectAll}>一键全选</Button> : <Button onClick={unSelectAll}>取消全选</Button>
        }
        {/* <Button onClick={changeIsViewDrawResult}>改变isViewDrawResult</Button> */}
      </div>
      <Table rowSelection={{ selectedRowKeys, onChange: onSelectChange }} dataSource={dataSource} columns={columns} />
      <Space>
        <Button onClick={addAccount}>添加账号</Button>
        <Button onClick={viewOperationLog} >查看操作日志</Button>
      </Space>
      <Modal okText="确定" cancelText="关闭" onOk={okModal} onCancel={closeModal} visible={showModal} closable={false}>
        <TextArea value={textAreaContent} onChange={handleTextAreaChange} placeholder='输入账号' autoSize={{ minRows: 6 }} rows={16} />
      </Modal>
      {contextHolder}
      {operationLogModalContext}
      {historyLogModalContextHolder}
      {/* <TextArea rows={16} value={JSON.stringify(dataSource)}>
      </TextArea> */}
    </div>
  )
}

