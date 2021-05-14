
const conf = {
    api_pin: 7465,
    api_key: process.env.VUE_APP_API_KEY, // replace with valid API Gateway Key in .env
    api_host: process.env.VUE_APP_API_URI, //API Gateway URI or, DNS aname FQDN in .env
    api_endpoint: process.env.VUE_APP_API_ENDPOINT, //API Gateway Endpoint Pointing At lambda handler in .env
}

export default conf;
