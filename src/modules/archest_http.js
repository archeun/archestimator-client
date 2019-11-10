import ArchestAuth from "./archest_auth";

const _ = require('lodash');
const axios = require('axios');

export default class ArchestHttp {

    /**
     * Performs a GET request to the given url, with the given params.
     *
     * @param url
     * @param params
     */
    static GET(url, params) {
        return axios.get(url, {params: params, headers: {'Authorization': 'Token ' + ArchestAuth.getToken()}});

    }

    /**
     * Performs a GET requests in batch mode
     *
     * @param requestConfigs
     */
    static BATCH_GET(requestConfigs, callback) {

        let requests = _.map(requestConfigs, requestConfig => {
            let authHeaders = {'Authorization': 'Token ' + ArchestAuth.getToken()};
            let headers = requestConfig.headers ? {...authHeaders, ...requestConfig.headers} : authHeaders;
            return axios.get(requestConfig.url, {params: requestConfig.params, headers: headers});
        });

        axios.all(requests).then(axios.spread((...responses) => {
            let callbackParams = {};
            for (let i = 0; i < requestConfigs.length; i++) {
                callbackParams[requestConfigs[i].name] = responses[i];
            }
            callback(callbackParams);
        }));
    }

    /**
     * Performs a POST request to the given url, with the given params.
     *
     * @param url
     * @param params
     * @param authenticate
     */
    static POST(url, params, authenticate = true) {

        const postParams = new URLSearchParams();

        _.each(params, function (value, key) {
            postParams.append(key, value);
        });

        let postConfig = {};
        if (authenticate) {
            postConfig['headers'] = {'Authorization': 'Token ' + ArchestAuth.getToken()};
        }
        return axios.post(url, postParams, postConfig);
    }

    /**
     * Performs a PATCH request to the given url, with the given params.
     *
     * @param url
     * @param params
     */
    static PATCH(url, params) {
        return axios.patch(url, params, {headers: {'Authorization': 'Token ' + ArchestAuth.getToken()}});
    }

    /**
     * Performs a DELETE request to the given url, with the given params.
     *
     * @param url
     * @param params
     */
    static DELETE(url, params) {

        const patchParams = new URLSearchParams();
        _.each(params, function (value, key) {
            patchParams.append(key, value);
        });

        return axios.delete(url, {headers: {'Authorization': 'Token ' + ArchestAuth.getToken()}}, patchParams);
    }

}