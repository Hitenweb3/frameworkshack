import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'

type State = {
  channels: string[],
  data: string[],
  casts: string[]
}

 
export const app = new Frog<{ State: State }>({
  initialState: {
    channels: ["Base", "Degen", "Founders"],
    data: ["100", "200", "300"],
    casts: ["yolo", "FC", "WAGMI"]
  }
})

app.use('/*', serveStatic({ root: './public' }))

app.frame('/', (c) => {
  
  return c.res({
    image: (
      <div style={{ 
        background: 'blue',
        color: 'white', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontSize: 60,
        display: 'flex',
        height: '100%',
        textAlign: 'center',
        width: '100%',
        }}>
        Channel Digest
      </div>
    ),
    intents: [
      <Button action="/trendingdata" value="LetsGo">Lets Go</Button>,
    ]
  })
})

app.frame('/trendingdata', async (c) => {
  const response = await fetch('https://api.neynar.com/v2/farcaster/channel/trending?time_window=7d', {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api_key': 'C0E4D0E1-A9E4-40B7-B5CE-2CFA9FF4CE1F'
    }
  })
  const channelistres = await response.json()
  console.log(channelistres)
  const { deriveState } = c
  const state = deriveState(previousState => {
    previousState.channels
  })

  return c.res({
    image: (
      <div style={{ color: 'black', display: 'flex', flexDirection: 'column', fontSize: 40 }}>
        <h2>Trending Channels</h2>
        {channelistres.channels.slice(0, 5).map((item, index) => (
          <div key={index}>{`${index + 1}. ${JSON.stringify(item.channel.name)}`}</div>  
        ))}
      </div>
    ),
    intents: [
      <Button action="/summary" value={state.channels[0]}>1</Button>,
      <Button action="/summary" value={state.channels[1]}>2</Button>,
      <Button action="/summary" value={state.channels[2]}>3</Button>,
      <Button.Reset>Reset</Button.Reset>
    ]
  })
})



// Frame to display summmary 
app.frame('/summary', (c) => { 
  const { buttonValue } = c
  return c.res({
    image: (
      <div style={{ color: 'black', display: 'flex', fontSize: 60 }}>
        Summary: {buttonValue}
      </div>
    ),
    intents: [
      <Button action="/stats" value={buttonValue}>Stats</Button>,
      <Button action="/recentcasts" value={buttonValue}>Casts</Button>,
      <Button.Reset>Reset</Button.Reset>
    ]
  })
})


// Frame to display data 
app.frame('/stats', (c) => { 
  const { buttonValue } = c
  return c.res({
    image: (
      <div style={{ color: 'black', display: 'flex', fontSize: 60 }}>
        Stats: {buttonValue}
      </div>
    ),
    intents: [
      <Button action="/summary" value={buttonValue}>Summary</Button>,
      <Button action="/recentcasts" value={buttonValue}>Casts</Button>,
      <Button.Reset>Reset</Button.Reset>
    ]
  })
})


// Frame to display casts 
app.frame('/recentcasts', (c) => { 
  const { buttonValue } = c
  return c.res({
    image: (
      <div style={{ color: 'black', display: 'flex', fontSize: 60 }}>
        Casts: {buttonValue}
      </div>
    ),
    intents: [
      <Button action="/summary" value={buttonValue}>Summary</Button>,
      <Button action="/stats" value={buttonValue}>Stats</Button>,
      <Button.Reset>Reset</Button.Reset>
    ]
  })
})



devtools(app, { serveStatic })


// app.frame('/trendinglist', neynarMiddleware, (c) => {
//   console.log('interactor: ', c.var)
//   const { deriveState } = c
//   const state = deriveState(previousState => {
//     previousState.channels
//   })

//   return c.res({
//     image: (
//       <div style={{ color: 'black', display: 'flex', fontSize: 60 }}>
//        <ul>
//          {state.channels.map((value, index) => 
//             <li key={index}>{`${index + 1}. ${value}`}</li>
//             )}
//        </ul>
//       </div>
//     ),
//     intents: [
//       <Button action="/summary" value={state.channels[0]}>1</Button>,
//       <Button action="/summary" value={state.channels[1]}>2</Button>,
//       <Button action="/summary" value={state.channels[2]}>3</Button>,
//       <Button.Reset>Reset</Button.Reset>
//     ]
//   })
// })


// app.frame('/trendingdata', async (c) => {
//   const response = await fetch('https://api.neynar.com/v2/farcaster/feed/trending?limit=10&time_window=24h', {
//     method: 'GET',
//     headers: {
//       'accept': 'application/json',
//       'api_key': 'C0E4D0E1-A9E4-40B7-B5CE-2CFA9FF4CE1F'
//     }
//   })
//   const data = await response.json()
//   console.log(data)
//   return c.res({
//     image: (
//       <div style={{ color: 'black', display: 'flex', flexDirection: 'column', fontSize: 20 }}>
//         {data.casts.map((item, index) => (
//           <div key={index}>{JSON.stringify(item.text)}</div>
//         ))}
//       </div>
//     ),
//     intents: [
//       <Button.Reset>Reset</Button.Reset>
//     ]
//   })
// })



// app.frame('/trendinglist', neynarMiddleware, (c) => {
//   console.log('interactor: ', c.var)
//   const { deriveState } = c
//   const state = deriveState(previousState => {
//     previousState.channels
//   })

//   return c.res({
//     image: (
//       <div style={{ color: 'black', display: 'flex', fontSize: 60 }}>
//        <ul>
//          {state.channels.map((value, index) => 
//             <li key={index}>{`${index + 1}. ${value}`}</li>
//             )}
//        </ul>
//       </div>
//     ),
//     intents: [
//       <Button action="/summary" value={state.channels[0]}>1</Button>,
//       <Button action="/summary" value={state.channels[1]}>2</Button>,
//       <Button action="/summary" value={state.channels[2]}>3</Button>,
//       <Button.Reset>Reset</Button.Reset>
//     ]
//   })
// })


//Template
// export const app = new Frog({
//   // Supply a Hub to enable frame verification.
//   // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
// })

// app.use('/*', serveStatic({ root: './public' }))

// app.frame('/', (c) => {
//   const { buttonValue, inputText, status } = c
//   const fruit = inputText || buttonValue
//   return c.res({
//     image: (
//       <div
//         style={{
//           alignItems: 'center',
//           background:
//             status === 'response'
//               ? 'linear-gradient(to right, #432889, #17101F)'
//               : 'black',
//           backgroundSize: '100% 100%',
//           display: 'flex',
//           flexDirection: 'column',
//           flexWrap: 'nowrap',
//           height: '100%',
//           justifyContent: 'center',
//           textAlign: 'center',
//           width: '100%',
//         }}
//       >
//         <div
//           style={{
//             color: 'white',
//             fontSize: 60,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1.4,
//             marginTop: 30,
//             padding: '0 120px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           {status === 'response'
//             ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
//             : 'Welcome!'}
//         </div>
//       </div>
//     ),
//     intents: [
//       <TextInput placeholder="Enter custom fruit..." />,
//       <Button value="apples">Apples</Button>,
//       <Button value="oranges">Oranges</Button>,
//       <Button value="bananas">Bananas</Button>,
//       status === 'response' && <Button.Reset>Reset</Button.Reset>,
//     ],
//   })
// })