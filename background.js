const translateBaseUrl =
  'https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i='

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === 'hello') sendResponse({ farewell: 'goodbye' })
})

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'run-translate':
      translateSubtitleProcess()
      break
    default:
      break
  }
})

function translateSubtitleProcess() {
  console.log('run translate...')
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { getSubtitle: 'getSubtitle' },
      function (response = {}) {
        fetch(`${translateBaseUrl}${response.subtitleText}`, {
          method: 'get',
          mode: 'cors'
        })
          .then((response) => response.json())
          .then((data) => {
            const { translateResult } = data
						const translateText = translateResult[0][0].tgt;

						chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
							chrome.tabs.sendMessage(tabs[0].id, {type: 'translateText', text: translateText}, function(response) {
								console.log(response);
							});
						});

						// console.log('result', translateResult[0][0].tgt)
          })
      }
    )
  })
}

// fetch('https://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=You%20have%20to%20listen%20to%20all%20of%20it', {
// 	method: 'get',
// 	mode: 'cors',
// }).then(response => response.json());
