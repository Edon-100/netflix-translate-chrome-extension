console.log('content script running')

const NETFLIX_SUBTITLE_WRAPPER_SELECTOR =
  '.player-timedtext-text-container>span'

function initProcess() {
  initExtensionListner()
}

/**
 * @description 获取当前字幕
 */
function getPlayingSubtitle() {
  let text = ''
  const subtitleSpan = document.querySelectorAll(
    NETFLIX_SUBTITLE_WRAPPER_SELECTOR
  )
  subtitleSpan.forEach((span) => {
    text += span.innerText
  })
  return text
}

function initExtensionListner() {
  chrome.runtime.onMessage.addListener(function (
    { type, data },
    sender,
    sendResponse
  ) {
    switch (type) {
      case 'getSubtitle':
        let text = getPlayingSubtitle()
        sendResponse({ type: 'passSubtitleText', data: text })
        break
      case 'sendTranslateText':
        generateChineseTranslate(data)
        break
      default:
        break
    }
  })
}

/**
 * @description 把翻译之后的字幕放到页面中
 * @param {string} text 翻译成中文的字幕
 */
function generateChineseTranslate(text) {
  const span = document.createElement('span')
  span.innerText = `T: ${text}`
  span.id = 'translateText'
  span.style =
    'position:absolute;bottom:30%;left:46%;font-size:20px;cursor:pointer;color:'
  const videoParent = document.querySelector('video').parentElement
  videoParent.append(span)
  span.addEventListener('click', () => {
    videoParent.removeChild(span)
  })
  setTimeout(() => {
    videoParent.removeChild(span)
  }, 5000)
}

initProcess()