import conf from '../config/conf.js'


const Api = {

    path:`${conf.api_host}/${conf.api_endpoint}`,
    //path: 'http://localhost/ver_api/',
    
    headers: {
        'X-Api-Key': conf.api_key,
        'Content-Type': 'application/json',
    },

    request: (params)=> {
        return fetch(Api.query(params), {method:'GET', headers:Api.headers});
    },

    response:(evt)=>{
        return JSON.parse(evt.target.response)
    },

    latest_version_for_product_env: (environment, product) => {
        let params = {action:'latest_version_for_product_env', environment: environment, product: product};
        return Api.request(params);
    },
    
    previous_versions_for_product: (product, limit=5) => {
        let params = {action:'previous_versions_for_product', product: product, limit: limit};
        return Api.request(params);
    },

    latest_versions_for_env:(environment) => {
        let params = { action:'latest_versions_for_env', environment: environment};
        return Api.request(params);
    },

    latest_versions:() => {
        let params = { action: 'latest_versions'};
        return Api.request(params);
    },

    query:(params)=>{
        let p = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        return Api.path + "?" + p
      },
    
}

export default Api;
