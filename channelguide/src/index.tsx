import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/middlewares'

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

// app.use(
//   neynar({
//     apiKey: 'C0E4D0E1-A9E4-40B7-B5CE-2CFA9FF4CE1F',
//     features: ['interactor', 'cast'],
//   }),
// )

app.use('/*', serveStatic({ root: './public' }))

app.frame('/', (c) => {
  console.log('cast: ', c.var)
  // const { displayName, followerCount } = c.var.interactor || {}
  // console.log('cast: ', c.var.cast)
  // console.log('interactor: ', c.var.interactor)

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
        {/* Greetings {displayName}, you have {followerCount} followers. */}
      </div>
    ),
    intents: [
      <Button action="/trendinglist" value="LetsGo">Lets Go</Button>,
    ]
  })
})


// Frame to display casts 
app.frame('/next', (c) => { 
  return c.res({
    image: (
      <div style={{ color: 'black', display: 'flex', fontSize: 60 }}>
        Casts:
      </div>
    ),
    intents: [
      <Button.Reset>Reset</Button.Reset>
    ]
  })
})


app.frame('/trendinglist', (c) => {
  const { deriveState } = c
  const state = deriveState(previousState => {
    previousState.channels
  })

  return c.res({
    image: (
      <div style={{ color: 'black', display: 'flex', fontSize: 60 }}>
       <ul>
         {state.channels.map((value, index) => 
            <li key={index}>{`${index + 1}. ${value}`}</li>
            )}
       </ul>
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