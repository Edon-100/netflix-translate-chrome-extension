console.log('content script running')
const translateBaseUrl = 'https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i='

const div = document.createElement('div')
div.id = 'scriptSender'
div.innerText = 'send'
div.style =
  'width:100px;height:40px;position:absolute;bottom:40%;left:46%;font-size:20px;cursor:pointer'
div.addEventListener('click', () => {
  console.log(1)
  chrome.runtime.sendMessage({ greeting: 'hello' }, function (response) {
    console.log(response.farewell)
  })
})
document.body.append(div)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.getSubtitle === 'getSubtitle') {
    const subtitleSpan = document.querySelector(
      '.player-timedtext-text-container>span'
    )
    const subtitle = subtitleSpan.innerText
		// console.log('current subtitle', subtitle)
		// fetch(`${translateBaseUrl}${subtitle}`)
    sendResponse({ subtitleText: subtitle })
  } else if (request.type === 'translateText') {
		console.log('get translateText', request.translateText )
	}
})
