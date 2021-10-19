function init() {
  addListener()
}

function addListener() {
  const btn = document.querySelector('#exportText')
  btn.addEventListener('click', () => {
    chrome.storage.local.get(['subtitle1'], function (result) {
      const contentArr = result.subtitle1 || []
      if (!contentArr.length) {
        return alert('没有内容可以导出')
      }
      const content = contentArr.reduce((total, cur) => {
        return (total += `${cur}\r\n`)
      }, '')
      downloadTXTByContent(content)
    })
  })
}

function downloadTXTByContent(content) {
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
  )
  element.setAttribute('download', `word_${Date.now()}.txt`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

init()
