const tAuth = require('./secrets').TwitterAUth
const rp = require('request-promise')

const tokenOptions = {
  method: 'POST',
  uri: 'https://api.twitter.com/oauth2/token',
  form: {
    'grant_type': 'client_credentials'
  },
  headers: {
    authorization: `Basic ${tAuth}`
  },
  json: true
};

const buildBearer = token => {
  return "Bearer " + token
}

const getTweetOptions = (bearerToken, queryString) => (
  {
    method: 'GET',
    uri: 'https://api.twitter.com/1.1/search/tweets.json',
    qs: {q: queryString},
    headers: {
      authorization: bearerToken
    },
    json: true
  }
)

const countWords = (list) => {
  const wordCount ={}

  list.forEach(function (word) {
    wordCount[word] = wordCount[word] + 1 || 1
  })

  return (wordCount)
}

const start = async (keyword) => {
  const response = await rp(tokenOptions)

  const accToken = response.access_token
  console.log('Got the token:', accToken)

  const tweetOptions = getTweetOptions(buildBearer(accToken), keyword)

  const tweetResponse = await rp(tweetOptions)
  console.log('received', tweetResponse.statuses.length, 'tweets')

  // console.log(tweetResponse.statuses)

  const wordList = []

  tweetResponse.statuses.map(
    status => {
     const txt = status.text
     const items = txt.split(' ')
     items.forEach((t) => {
         wordList.push(t)
         // console.log(t)
       }
     )
    }
  )
  console.log(wordList.length.toString(), 'words')
  console.log(countWords(wordList))

}

start('ocean').catch((err) => {
  console.log("ERROR", err)
})
