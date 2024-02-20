const OMDB_KEY = process.env.OMDB_KEY

const baseUrl = "https://www.omdbapi.com/?apikey="
const searchQuery = "&s="

const handler = async(event) => {
  try{
    // const response = fetch(baseUrl + OMDB_KEY + searchQuery + searchString)
    console.log(event.body)
    // return {
    //   statusCode: 200,
    //   body: response
    // }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

// // Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
// const handler = async (event) => {
//   try {
//     const response = queryStringURL
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: `Hello ${subject}` }),
//       // // more keys you can return:
//       // headers: { "headerName": "headerValue", ... },
//       // isBase64Encoded: true,
//     }
//   } catch (error) {
//     return { statusCode: 500, body: error.toString() }
//   }
// }

// module.exports = { handler }

// import { Configuration, OpenAIApi } from 'openai'

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// })

// const openai = new OpenAIApi(configuration)

// const handler = async (event) => {
//     try {
//         const response = await openai.createCompletion({
//             model: 'davinci:ft-scrimba-2023-03-30-23-10-03',
//             prompt: event.body,
//             max_tokens: 500,
//             presence_penalty: 0.3,
//             frequency_penalty: 0,
//             temperature: 0,
//             stop: ['\n', '->']
//         })
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 reply: response.data                
//             })
//         }
//     } catch (error) {
//         return { statusCode: 500, body: error.toString() }
//     }
// }

// module.exports = { handler }