/**
 * 
 * @file AudioResourceService_TTSAPI.js
 * @fileOverview 
 * File containing the declaration of the AudioResourceService_TTSAPI class.
 * 
 * @author Abalta Technologies, Inc.
 * @date June, 2013
 *
 * @cond Copyright
 *
 * COPYRIGHT 2007 ABALTA TECHNOLOGIES or "CUSTOMER NAME"
 * ALL RIGHTS RESERVED.<p>
 * This program may not be reproduced, in whole or in
 * part in any form or any means whatsoever without the
 * written permission of ABALTA TECHNOLOGIES or "CUSTOMER
 * NAME".
 *
 * @endcond
 */

        /**
         * @namespace Namespace of the current web application.
         */
        window.sportsnewsfeedapp = window.sportsnewsfeedapp || {};

/**
 * @namespace Namespace for the services.
 */
window.sportsnewsfeedapp.services = window.sportsnewsfeedapp.services || {};

/**
 * @exports ns_service as window.sportsnewsfeedapp.services
 */
var ns_services = window.sportsnewsfeedapp.services;

/*
 * 
 * mapping constants
 * key: field name of data returned by service 
 * value: field name of data to be stored into model. This should be the same for all services
 */

ns_services.CONSTANTS = (function() {
    var constantArray = {
        audioResourceListKeyMap: {
            'urlList': 'urlList',
            'type': 'type',
            'isRemote': 'isRemote',
            'originalText': 'originalText'
        }
    };

    return {
        get: function(name) {
            return constantArray[name];
        }
    };
})();

/**
 * Creates a AudioResourceService_TTSAPI.
 * 
 * @class Class that is used by the Models to obtain audio resource data.
 * @exports ns_services as window.sportsnewsfeedapp.services
 */
ns_services.audioResourceService_TTSAPI = function() {

    /**
     * public properties
     * 
     */

    // constants
    this.DEVELOPMENT_URL = "http://tts-api.com/tts.mp3";
    this.DEV_API_KEY = "";
    this.PRODUCTION_URL = "http://tts-api.com/tts.mp3";
    this.PRODUCTION_API_KEY = "";
    this.DATA_TYPE = "mp3";
    this.OPTIONS_MAP = {
        'isAdhoc': 'isAdhoc',
        'paragraphToRead': 'paragraphToRead'
    };
    this.CHARACTER_LIMIT = 80;

    /**
     * Array for the audio resource data.
     */
    this.audioResourceListData = {};


};


/**
 * Set audio resource data 
 * 
 * @param newData audio resource value
 * 
 */
ns_services.audioResourceService_TTSAPI.prototype.setAudioResourceListData = function(newData) {
    this.audioResourceListData = newData;
};

/**
 * Retrieves initial data.
 * 
 * @returns the initial data
 * 
 */
ns_services.audioResourceService_TTSAPI.prototype.getInitialData = function() {
    return {};
};

/**
 * Creates a new array with the same values but different
 * keys. Must be called when returning data to Model; in order to follow Model's
 * structure e.g. data { first: 26, second: 37 } will be mapped into data { 1st:
 * 26, 2nd: 38 }
 * 
 * @returns the new array with keys mapped using keymap
 * @param data the original array
 * @param keymap the name of the keymap that will be used for key mapping. The keymap be fetched from CONSTANTS
 * 
 */

ns_services.audioResourceService_TTSAPI.prototype.copyArrayUsingKeyMap = function(
        data, keymap) {
    var copy = Object.create(Object.getPrototypeOf(data));
    var propNames = Object.getOwnPropertyNames(data);
    var singleStationKeyMap = ns_services.CONSTANTS.get(keymap);// fetching keymap , e.g. 'singleStationKeyMap' or 'sportsnewsfeedKeyMap' from CONSTANTS

    propNames.forEach(function(name) {
        var desc = Object.getOwnPropertyDescriptor(data, name);
        Object.defineProperty(copy, singleStationKeyMap[name], desc);
    });

    return copy;
};

/**
 * Retrieves audio resource data from TTSAPI service. 
 * 
 * @returns {array} the audio resource data, including
 *              'feedList': array that contains news feed info
 * 
 * @param {array} options includes
 *                  {string} paragraphToSpeak the paragraph that will be broken and read aloud
 *                  {boolean} adhoc if request is ad-hoc, success function 
 *          must call back to notify MODEL as soon as data arrives
 *          
 *          sample call: http://tts-api.com/tts.mp3?q=hello%20world
 * 
 */
ns_services.audioResourceService_TTSAPI.prototype.getAudioResourceListData = function(
        options) {

    var returnData = {
        'urlList': [],
        'type': 'mp3',
        'isRemote': true,
        'originalText': options['paragraphToSpeak']
    };

    if ((options.paragraphToSpeak === "") | (typeof(options.paragraphToSpeak) === "undefined")) {
        return {};
    }
    ;

    options.paragraphToSpeak = encodeURIComponent(options.paragraphToSpeak);
    returnData.urlList[0] = this.DEVELOPMENT_URL + "?q=" + options.paragraphToSpeak;

    if (options.isAdhoc) {
        window.sportsnewsfeedapp.models.AudioResourceModel.onNewAudioResourceListData(returnData);
    }
    return returnData;
};