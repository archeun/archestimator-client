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
     * Performs a POST request to the given url, with the given params.
     *
     * @param url
     * @param params
     */
    static POST(url, params) {

        const postParams = new URLSearchParams();

        _.each(params, function (value, key) {
            postParams.append(key, value);
        });

        return axios.post(url, postParams);
    }

    /**
     * Performs a PATCH request to the given url, with the given params.
     *
     * @param url
     * @param params
     */
    static PATCH(url, params) {

        const patchParams = new URLSearchParams();
        _.each(params, function (value, key) {
            patchParams.append(key, value);
        });

        return axios.patch(url, patchParams, {headers: {'Authorization': 'Token ' + ArchestAuth.getToken()}});
    }

}