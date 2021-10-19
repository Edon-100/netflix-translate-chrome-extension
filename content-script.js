console.log('content script running')

// const translateBaseUrl =
//   'https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i='

function getPlayingSubtitle() {
  const subtitleSpan = document.querySelector(
    '.player-timedtext-text-container>span'
  )
  return subtitleSpan.innerText
}

function initProcess() {
  generateDom()
  connetBackground()
}

function generateDom() {
  // const div = document.createElement('div')
  // div.id = 'scriptSender'
  // div.innerText = 'send'
  // div.style =
  //   'width:100px;height:40px;position:absolute;bottom:40%;left:46%;font-size:20px;cursor:pointer'
  // div.addEventListener('click', () => {
  //   console.log('1')
  // })
  // document.body.append(div)
}

function connetBackground() {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.getSubtitle === 'getSubtitle') {
      let text=''
      const subtitleSpan = document.querySelectorAll(
        '.player-timedtext-text-container>span'
      )
      subtitleSpan.forEach(span => {
        text += span.innerText
      })
      console.log('current subtitle', text)
      // fetch(`${translateBaseUrl}${subtitle}`)
      sendResponse({ subtitleText: text })
    } else if (request.type === 'translateText') {
      console.log('get translateText', request)
      generateChineseTranslate(request.text)
    }
  })
}

function generateChineseTranslate(text) {
  const span = document.createElement('span')
  span.innerText = text
  span.id = 'translateText'
  span.style = 'position:absolute;bottom:36%;left:46%;font-size:20px;cursor:pointer'
  document.body.append(span)
  span.addEventListener('click', () => {
    document.body.removeChild(span)
  })
  setTimeout(() => {
    document.body.removeChild(span)
  }, 5000)
}

initProcess()
