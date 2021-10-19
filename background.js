const REQUEST_BASE_URL =
  'https://service-pnrys8g3-1254074572.bj.apigw.tencentcs.com/release'

const AppInfo = {
  appkey: '3bc15f324114c0f3',
  key: 'v5rQlNuFWiR5SrwW5ob5jl4SUbDhFDua'
}

initProcrss()

function initProcrss() {
  initDeclarativeContent()
  initMessageListener()
  initShorcutListener()
}

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
        actions: [new chrome.declarativeContent.ShowPageAction()]
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

