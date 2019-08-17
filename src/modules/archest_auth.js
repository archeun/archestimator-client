import {LOCAL_STORAGE_TOKEN_KEY} from "../constants";

export default class ArchestAuth {

    /**
     * Returns the authentication token stored inside the local storage
     */
    static getToken() {
        return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    }

    /**
     * Stores the authentication token in the local storage
     */
    static setToken(token) {
        return localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    }


}