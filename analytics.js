import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { Serializable } from './hits';

const packageDotJson = require('../../package.json');

const { width, height } = Dimensions.get('window');

let defaultOptions = { debug: false };

export default class Analytics {
    ready = false
    queue = []
    customDimensions = []
    userAgent = ''
    clientId = null

    constructor(propertyId, additionalParameters = {}, options = defaultOptions){
        this.propertyId = propertyId;
        this.options = options;

        this.parameters = {
            an: packageDotJson.name,
            aid: packageDotJson.name,
            av: packageDotJson.version,
            sr: `${width}x${height}`,
            ...additionalParameters
        };

        this.setup()
    }

    setup = async () => {
        try {
            this.clientId = DeviceInfo.getUniqueID();
            this.userAgent = await DeviceInfo.getUserAgent();

            if(this.options.debug){
                console.log(`[react-native-googleanalytics] UserAgent=${this.userAgent}`);
                console.log(`[react-native-googleanalytics] Additional parameters=`, this.parameters);
            }
        } catch (error) {
            if(this.options.debug){
                console.log(error);
            }
        } finally {
            this.ready = true;
        }
    }

    hit(hit){
        this.queue.push(hit);
        this.flush();
    }

    event(event){
        this.queue.push(event);
        this.flush();
    }

    addCustomDimension(index, value){
        this.customDimensions[index] = value;
    }

    removeCustomDimension(index){
        delete this.customDimensions[index];
    }

    flush(){
        if(this.ready){
            while(this.queue.length){
                const hit = this.queue.pop();
                this.send(hit)
                .then(() => hit.sent = true);
            }
        }
    }

    send(hit) {
        /* format: https://www.google-analytics.com/collect? +
        * &tid= GA property ID (required)
        * &v= GA protocol version (always 1) (required)
        * &t= hit type (pageview / screenview)
        * &dp= page name (if hit type is pageview)
        * &cd= screen name (if hit type is screenview)
        * &cid= anonymous client ID (optional if uid is given)
        * &uid= user id (optional if cid is given)
        * &ua= user agent override
        * &an= app name (required for any of the other app parameters to work)
        * &aid= app id
        * &av= app version
        * &sr= screen resolution
        * &cd{n}= custom dimensions
        * &z= cache buster (prevent browsers from caching GET requests -- should always be last)
        */

        const customDimensions = this.customDimensions.map((value, index) => `cd${index}=${value}`).join('&');

        const params = new Serializable(this.parameters).toQueryString();

        const url = `https://www.google-analytics.com/collect?tid=${this.propertyId}&v=1&cid=${this.clientId}&${hit.toQueryString()}&${params}&${customDimensions}&z=${Math.round(Math.random() * 1e8)}`;

        let options = {
            method: 'get',
            headers: {
                'User-Agent': this.userAgent
            }
        }

        if(this.options.debug){
            console.log(`[react-native-googleanalytics] Sending GET request to ${url}`);
        }

        return fetch(url, options);
    }

}
