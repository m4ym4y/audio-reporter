async function postAudibleTab (message) {
  const resp = await fetch('http://localhost:9000', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ message })
  })

  if (!resp.ok) {
    console.error('Error posting to server: ' + resp.statusText)
  }
}

async function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function backgroundProcess () {
  let message

  while (true) {
    const audibleTabs = await browser.tabs.query({ audible: true })  

    if (audibleTabs.length === 0) {
      message = "Not currently playing"
    } else {
      message = audibleTabs[0].title
    }

    try {
      await postAudibleTab(message)
      lastMessage = message
    } catch (e) {
      console.error("Failed to post", e)
    }

    await sleep(1000)
  }
}

backgroundProcess()
  .catch(e => {
    console.error("Background process crash:", e)
  })
