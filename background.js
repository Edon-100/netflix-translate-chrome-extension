const REQUEST_BASE_URL =
  'https://service-pnrys8g3-1254074572.bj.apigw.tencentcs.com/release'

const AppInfo = {
  appkey: '3bc15f324114c0f3',
  key: 'v5rQlNuFWiR5SrwW5ob5jl4SUbDhFDua'
}

let subtitleBackup = []

function initDeclarativeContent() {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable()

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      var rule = {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.netflix.com/', schemes: ['https'] },
            css: ['.player-timedtext-text-container']
          })
        ],
        actions: [new chrome.declarativeContent.ShowAction()]
      }
      chrome.declarativeContent.onPageChanged.addRules([rule])
    })
  })
}

function initMessageListener() {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log('request sender', requesr, sender)
  })
}

function initShorcutListener() {
  chrome.commands.onCommand.addListener((command) => {
    switch (command) {
      case 'run-translate':
        translateSubtitleProcess()
        break
      default:
        break
    }
  })
}

/**
 * @description 接受到快捷键命令后，开始走翻译流程
 */
function translateSubtitleProcess() {
  console.log('run translate...')
  sendMessageToPage({ type: 'getSubtitle' }, (response) => {
    saveOriginalSubtitle(response.data)
    requestTranslate(response.data).then((translateText) =>
      sendMessageToPage({
        type: 'sendTranslateText',
        data: translateText
      })
    )
  })
}

/**
 * @description 发送消息到content-script
 * @param {Object} message
 * @param {Function} cb 接受到返回的回调
 */
function sendMessageToPage(message, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        type: message.type,
        data: message.data
      },
      cb
    )
  })
}

/**
 *
 * @param {string} text 需要翻译的字段
 * @returns {Promise<string>} 翻译的结果
 */
function requestTranslate(text) {
  return fetch(
    `${REQUEST_BASE_URL}?text=${text}&appkey=${AppInfo.appkey}&key=${AppInfo.key}`,
    {
      method: 'get',
      mode: 'cors'
    }
  )
    .then((response) => response.json())
    .then((data) => data.content.translation[0])
}

/**
 * @description 把翻译前的字幕保存起来
 * @param {string} text
 */
function saveOriginalSubtitle(text) {
  /*
    如果 subtitleBackup 没有值，说明还没从storage里面取值，就先去取值，然后备份到本地
    之后如果有备份，那么就不用执行一次get查询了，直接操作备份数据，然后set值
  */
  if (!subtitleBackup.length) {
    chrome.storage.local.get(['subtitle1'], function (result) {
      subtitleBackup = result.subtitle1 || []
      subtitleBackup.push(text)
      chrome.storage.local.set({ subtitle1: subtitleBackup })
    })
  } else {
    subtitleBackup.push(text)
    chrome.storage.local.set({ subtitle1: subtitleBackup })
  }
}

function initProcrss() {
  // initDeclarativeContent() // 不知道为何加了这个就不能弹出popup
  initMessageListener()
  initShorcutListener()
}

initProcrss()
