const translateBaseUrl =
  'https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i='

const requestBaseUrl =
  'https://service-pnrys8g3-1254074572.bj.apigw.tencentcs.com/release'

const AppInfo = {
  appkey: '3bc15f324114c0f3',
  key: 'v5rQlNuFWiR5SrwW5ob5jl4SUbDhFDua'
}

initProcrss()

function initProcrss() {
  initDeclarativeContent()
  // setTimeout(() => {
  //   initMessageConnection()
  // }, 10000)
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

function initMessageConnection() {
  console.log('initMessageConnection')
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   var port = chrome.tabs.connect(tabs[0].id, {name: 'test-connect'});
  //   port.postMessage({question: '你是谁啊？'});
  //   port.onMessage.addListener(function(msg) {
  //     alert('收到消息：'+msg.answer);
  //     if(msg.answer && msg.answer.startsWith('我是'))
  //     {
  //       port.postMessage({question: '哦，原来是你啊！'});
  //     }
  //   });
  // });
}

function initMessageListener() {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    // if (request.greeting === 'hello') sendResponse({ farewell: 'goodbye' })
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

function translateSubtitleProcess() {
  console.log('run translate...')
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { getSubtitle: 'getSubtitle' },
      function (response = {}) {
        searchWords(response.subtitleText).then(translateText => sendChineseToPage(translateText))
        // sendChineseToPage(translateText)
        // fetch(`${translateBaseUrl}${response.subtitleText}`, {
        //   method: 'get',
        //   mode: 'cors'
        // })
        //   .then((response) => response.json())
        //   .then((data) => {
        //     const { translateResult } = data
        //     const translateText = translateResult[0][0].tgt

        //     sendChineseToPage(translateText)
        //     console.log('result', translateResult, translateText)
        //   })
      }
    )
  })
}

function getYoudaoTranslate(text) {
  return new Promise((resolve, reject) => {
    fetch(`${translateBaseUrl}${response.subtitleText}`, {
      method: 'get',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((data) => {
        const { translateResult } = data
        const translateText = translateResult[0][0].tgt
        resolve(translateText)
      })
  })
}

function getYoudaoTranslate2(text) {
  return new Promise((resolve, reject) => {
    fetch(`${translateBaseUrl}${text}`, {
      method: 'get',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((data) => {
        const { translateResult } = data
        const translateText = translateResult[0][0].tgt
        resolve(translateText)
      })
  })
}

function searchWords(text) {
  return fetch(
    `${requestBaseUrl}?text=${text}&appkey=${AppInfo.appkey}&key=${AppInfo.key}`,
    {
      method: 'get',
      mode: 'cors'
    }
  ).then((response) => response.json()).then(data => data.content.translation[0])
}

function sendChineseToPage(text) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'translateText', text })
  })
}

// fetch('https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=You%20have%20to%20listen%20to%20all%20of%20it', {
// 	method: 'get',
// 	mode: 'cors',
// }).then(response => response.json());
