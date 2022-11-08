const fs    = require('fs')
    , path  = require('path')
    , end   = require('node-mermaid-extension/plugin/end')
    , NME   = require('node-mermaid-extension')

const Mermaid = NME({
  port: 3333,
  debug: false,
  test: false
})

const date = new Date()

const intercepter = ({ fetch, test }) => {
  fetch.usePost('/events', ({ event, parseBase64, sendMessageSocket, nextPlugin }) => {

    if (!event.isParsedEvent) {
      const data = `---------------------------------\n\n${parseBase64(event.pureEvent)}\n\n`

      fs.appendFileSync(path.join(__dirname, 'events', event.platform + '-' + date), data)
    }

    nextPlugin()
  })
}

;(async () => {
  const extension = await Mermaid.ready()

  extension.use(intercepter)
  extension.use(end)
})()
