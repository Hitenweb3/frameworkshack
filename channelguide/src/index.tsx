import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'

type State = {
  channels: string[],
  data: string[],
  casts: string[]
}

 
export const app = new Frog<{ State: State }>({
  initialState: {
    channels: [],
    data: ["100", "200", "300"],
    casts: []
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

  const { deriveState } = c

  const state = deriveState(previousState => {
    previousState.channels = channelistres.channels.slice(0, 10).map(channel => channel.channel.name);
  });


  return c.res({
    image: (
      <div style={{ color: 'black', display: 'flex', flexDirection: 'column', fontSize: 30 }}>
        <h2>Trending Channels</h2>
        {state.channels.map((item, index) => (
          <div key={index}>{`${index + 1}. ${item}`}</div>  
        ))}
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter the channel #" />,
      <Button action="/summary" value={c.inputText}>Submit</Button>,
      <Button.Reset>Reset</Button.Reset>
    ]
  })
})




// Frame to display summmary 
app.frame('/summary', async (c) => { 
  const {buttonValue, deriveState} = c
 
  let selectedChannel = '';
  deriveState(previousState => {
    selectedChannel = previousState.channels[parseInt(c.inputText || '0') - 1];
  });

  let coherecastsummary = '';

fetch(`https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=channel_id&channel_id=${selectedChannel}&with_recasts=false&limit=10`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api_key': 'C0E4D0E1-A9E4-40B7-B5CE-2CFA9FF4CE1F'
    }
  })
  .then(response => response.json())
  .then(neynarData => {
    const paragraph = neynarData.casts.map((cast: any) => cast.text).join(' ');

    const cohereData = {
      text: paragraph
    };

    return fetch('https://api.cohere.ai/v1/summarize', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Bearer 44LY7lECooRDxdN8F8LI0o8TzuiVhnlYLl0sXfZW'
      },
      body: JSON.stringify(cohereData)
    });
  })
  .then(cohereResponse => cohereResponse.json())
  .then(cohereResult => {
    console.log("summary", cohereResult.summary);
    coherecastsummary = cohereResult.summary;
  })
  .catch(error => console.error('Error:', error));

  if (coherecastsummary === '') {
    return new Promise((resolve) => {    
      setTimeout(() => {
      resolve(void 0);
      }, 4000); 
    }).then(() => {
      return c.res({
        image: (
          <div style={{ color: 'black', display: 'flex', fontSize: 25 }}>
            {coherecastsummary === '' || coherecastsummary === undefined ? 
            'Unable to get data try another channel' : coherecastsummary}
          </div>
        ),
        intents: [
          <Button action="/stats" value={buttonValue}>Stats</Button>,
          <Button action="/recentcasts" value={buttonValue}>Casts</Button>,
          <Button action="/trendingdata" value="Trending">Trending</Button>,
          <Button.Reset>Reset</Button.Reset>
        ]
      });
    });
  }
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
      <Button action="/trendingdata" value="Trending">Trending</Button>,
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
      <Button action="/trendingdata" value="Trending">Trending</Button>,
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

// const cohereData = {
    //   model: "command-light",
    //   prompt: `Summarize: ${paragraph}`,
    //   message: paragraph,
    //   temperature: 0.3,
    //   prompt_truncation: "AUTO",
    //   stream: true,
    //   citation_quality: "fast",
    //   connectors: [],
    //   documents: []
    // };

    // return fetch('https://api.cohere.ai/v1/chat', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer 44LY7lECooRDxdN8F8LI0o8TzuiVhnlYLl0sXfZW',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(cohereData)
    // });

  // const response = await fetch(`https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=channel_id&channel_id=${buttonValue}&with_recasts=false&limit=25`, {
  //   method: 'GET',
  //   headers: {
  //     'accept': 'application/json',
  //     'api_key': 'C0E4D0E1-A9E4-40B7-B5CE-2CFA9FF4CE1F'
  //   }
  // })

  // const paragraph = (await response.json()).casts.map(cast => cast.text).join(' ');

  // const cohereData = {
  //   model: "command-light",
  //   message: paragraph,
  //   temperature: 0.3,
  //   prompt_truncation: "AUTO",
  //   stream: true,
  //   citation_quality: "fast",
  //   connectors: [],
  //   documents: []
  // };

  // const cohereResponse = await fetch('https://api.cohere.ai/v1/chat', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': 'Bearer 44LY7lECooRDxdN8F8LI0o8TzuiVhnlYLl0sXfZW',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(cohereData)
  // });

  // const cohereResult = await cohereResponse.json();
  // console.log(cohereResult);