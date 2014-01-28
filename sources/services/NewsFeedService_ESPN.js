/**
 * 
 * @file newsFeedService_ESPN.js
 * @fileOverview 
 * File containing the declaration of the newsFeedService_ESPN class.
 * 
 * @author Abalta Technologies, Inc.
 * @date March, 2013
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
        singleStationKeyMap: {
            'foo': 'bar'
        },
        sportsNewsFeedListKeyMap: {
            'headline': 'headline',
            'lastModified': 'lastModified',
            'premium': 'premium',
            //links { mobile: { href: } 
            //            }

            'type': 'type',
            'section': 'section',
            'id': 'id',
            'title': 'title',
            'byline': 'byline',
            'linkText': 'linkText',
            'source': 'source',
            'description': 'description',
            'published': 'published'
        }
    };

    return {
        get: function(name) {
            return constantArray[name];
        }
    };
})();

/**
 * Creates a newsFeedService_ESPN.
 * 
 * @class Class that is used by the Models to obtain sport news feeds data.
 * @exports ns_services as window.sportsnewsfeedapp.services
 */
ns_services.newsFeedService_ESPN = function() {

    /**
     * public properties
     * 
     */

    // constants
    this.DEVELOPMENT_URL = "http://api.espn.com/v1/now";
    this.DEV_API_KEY = "zvn2yqv5urk9dpmbjcrksrbu";
    this.PRODUCTION_URL = "http://api.espn.com/v1/now";
    this.PRODUCTION_API_KEY = "zvn2yqv5urk9dpmbjcrksrbu";
    this.DATA_TYPE = "json";
    this.NEARBY_DISTANCE = 20;
    this.OPTIONS_MAP = {
        'foo': 'bar'
    };
    this.SERVER_SIDE_PHP_FILE = "http://www.usvsolutions.com/getweb.php";

    /**
     * Array for the sport news feeds data.
     */
    this.newsFeedData = {};

    /**
     * Object for the single sport news feed data.
     */
    this.singleNewsFeedData = {};


};


/**
 * Set sport news feeds data 
 * 
 * @param newData sport news feeds value
 * 
 */
ns_services.newsFeedService_ESPN.prototype.setnewsFeedData = function(newData) {
    this.newsFeedData = newData;
};




/**
 * Retrieves initial data.
 * 
 * @returns the initial data
 * 
 */
ns_services.newsFeedService_ESPN.prototype.getInitialData = function() {
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

ns_services.newsFeedService_ESPN.prototype.copyArrayUsingKeyMap = function(
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
 * Retrieves sport news feeds data from ESPN service. 
 * 
 * @returns {array} the sport news feeds data, including
 *              'feedList': array that contains news feed info
 * 
 * @param {array} options includes
 *                  resource The ESPN resource e.g. top, popular
 *                  leagues The sport league
 *                  {boolean} adhoc if request is ad-hoc, success function 
 *          must call back to notify MODEL as soon as data arrives
 *                  {integer} limit Number of items to retrieve
 
 *          
 *          sample call: http://api.espn.com/v1/now?apikey=zvn2yqv5urk9dpmbjcrksrbu&limit=10&leagues=nfl
 * 
 */
ns_services.newsFeedService_ESPN.prototype.getSportsNewsFeedListData = function(
        options) {

    var OPTIONS_MAP = this.OPTIONS_MAP;
    var DEVELOPMENT_URL = this.DEVELOPMENT_URL;
    var DEV_API_KEY = this.DEV_API_KEY;

    var url = DEVELOPMENT_URL;
    if (options.resource !== "") {
        url += "/" + options.resource;
    }
    ;
    url += "?apikey=" + DEV_API_KEY;
    url += "&limit=" + options['limit'];

    if (options.leagues !== "") {
        url += "&leagues=" + options.leagues;
    }
    ;

    var dataToSend = {};

    options.success = function(data) {

        //processing data
        var newFeedListData = data.feed;
        var feedListTimestamp = new Date();
        feedListTimestamp = data.timestamp;
        var size = data.resultslimit;
        var i = 0;
        while (i < size) {
            //storing feed headline
            newFeedListData[i] = ns_services.newsFeedService_ESPN.prototype
                    .copyArrayUsingKeyMap(newFeedListData[i], "sportsNewsFeedListKeyMap");
            i++;
        }

        /* storing data */
        data['feed'] = newFeedListData;

        ns_services.newsFeedService_ESPN.newsFeedData = data;
        //if this request is Ad-hoc, notifies MODEL immediately
        if (options['isAdhoc']) {
            var timestamp = new Date();
            var timeString = window.sportsnewsfeedapp.helper.HelperHolder
                    .dateFormatAMPM(timestamp);

            window.sportsnewsfeedapp.models.newsFeedModel.onNewNewsFeedListData(data, timeString);
            window.sportsnewsfeedapp.models.newsFeedModel.adHocCompleted();
        }
        /* console.log("Gas Stations data: " + this.newsFeedsData); */
    };

    options.error = function(error) {

        var output = 'error:';
        for (property in error) {
            output += property + ': ' + error[property] + '; ';
        }
        console.log(output);
    };

    $.ajax({url: url,
        data: dataToSend,
        success: options.success,
        dataType: "json"
    });
    return ns_services.newsFeedService_ESPN.newsFeedData;
};

/**
 * Retrieves a single sport news feed data from html; using external php request
 * Callback MODEL when new data arrives
 * 
 * @param {array} options 
 *            url: the mobile url that contains news content
 * @returns null
 */
ns_services.newsFeedService_ESPN.prototype.getSingleSportsNewsFeedDataFromPhp = function(
        options) {

    if (options["url"] === null) {
        return null;
    }

    var successFunction = function(data) {

        /* storing data */
        var returnedData = {};

        var newsEntry = $(data.html).find('div #left-column');

//             * Model:         details: {
//        * "updated"]);
//        "feedContentTitle";
//        "feedContentAuthor";
//        "feedContentParagraph";    
//    }
        var authorString = "";
        authorString = newsEntry.find('li.right').next().html();//"By Matt Fortuna | May 30, 2013 2:40 PM";
        var pattern = new RegExp(/(.)*\|/g);
        if ((typeof (authorString) !== "undefined") && (authorString !== "")) {
            var author = authorString.match(pattern);
            var updated = authorString.replace(author, "");
            author = String(author);
            author = author.replace(/ \|/g, "");
        }

        var feedContentParagraph = "";
        newsEntry.find("div.story-body>p").each(
                function() {
                    feedContentParagraph += $(this).text();
                    //adds a line break for every paragraph
                    feedContentParagraph += "<br>";
                });

        returnedData['details'] = {
            "updated": updated,
            "feedContentTitle": newsEntry.find("#mainpagetitle").html(),
            "feedContentAuthor": author,
            "feedContentParagraph": feedContentParagraph
        };

        //callback to notify MODEL immediately when new data arrives
        var timestamp = new Date();
        var timeString = window.sportsnewsfeedapp.helper.HelperHolder
                .dateFormatAMPM(timestamp);
        window.sportsnewsfeedapp.models.newsFeedModel.onNewSingleSportsNewsFeedData(returnedData, timeString);

    };

    var errorFunction = function(error) {

        var output = 'error:';
        for (property in error) {
            output += property + ': ' + error[property] + '; ';
        }
        console.log(output);
    };

    var ajaxUrl = this.SERVER_SIDE_PHP_FILE;
    ajaxUrl += "?url=" + encodeURIComponent(options['url']);
    ajaxUrl += "&jsoncallback=?";
//    var ajaxUrl = "http://m.espn.go.com/general/blogs/blogpost?blogname=nfceast&id=51689&ex_cid=espnapi_public&wjb";
//    var ajaxUrl = "http://www.pureexample.com/backend/ajax_crossdomain.aspx";

//    $.ajax({
//        url: ajaxUrl,
//        type: "GET",
//        data: {todo:"jsonp"},
//        dataType: 'jsonp',
//        crossDomain: true,
//        cache: false,
//        success: successFunction,
//        error: errorFunction
//    });

    $.getJSON(ajaxUrl, successFunction);

    return {};
};

/**
 * Retrieves a single sport news feed data from html; using cross-origin overwrite
 * Callback MODEL when new data arrives
 * 
 * @param {array} options 
 *            url: the mobile url that contains news content
 * @returns null
 */
ns_services.newsFeedService_ESPN.prototype.getSingleSportsNewsFeedData = function(
        options) {

    if (options["url"] === null) {
        return null;
    }

    var successCallback = function(response, status, xhr) {

        /* storing data */
        var returnedData = {};
        var status = xhr.status;
        var response = xhr.responseText;

        if (typeof (response) === "undefined") {
            return -1;
        }

        var newsEntry = $(response).find('div #left-column');

//        * Model:         details: {
//        * "updated"]);
//        "feedContentTitle";
//        "feedContentAuthor";
//        "feedContentParagraph";    
//    }
        var authorString = "";
        authorString = newsEntry.find('li.right').next().html();//"By Matt Fortuna | May 30, 2013 2:40 PM";
        var pattern = new RegExp(/(.)*\|/g);
        if ((typeof (authorString) !== "undefined") && (authorString !== "")) {
            var author = authorString.match(pattern);
            var updated = authorString.replace(author, "");
            author = String(author);
            author = author.replace(/ \|/g, "");
        }

        var feedContentParagraph = "";
        
        newsEntry.find("div.story-body>p").each(
                function() {
                    feedContentParagraph += $(this).text();
                    //adds a line break for every paragraph
                    feedContentParagraph += "<br>";
                });

        returnedData['details'] = {
            "updated": updated,
            "feedContentTitle": newsEntry.find("#mainpagetitle").html(),
            "feedContentAuthor": author,
            "feedContentParagraph": feedContentParagraph
        };

        //callback to notify MODEL immediately when new data arrives
        var timestamp = new Date();
        var timeString = window.sportsnewsfeedapp.helper.HelperHolder
                .dateFormatAMPM(timestamp);
        window.sportsnewsfeedapp.models.newsFeedModel.onNewSingleSportsNewsFeedData(returnedData, timeString);
    };

    var errorCallback = function(error) {

        var output = 'error:';
        for (property in error) {
            output += property + ': ' + error[property] + '; ';
        }
        console.log(output);
    };

    var requestCrossOriginWithCredentials = function(url, headers) {
        $.ajax({
            url: url,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function(xhr) {
                for (headerName in headers) {
                    xhr.setRequestHeader(headerName, headers[headerName]);
                }
            },
            success: successCallback,
            error: errorCallback
        });
    };

    requestCrossOriginWithCredentials(options.url, {});

    return {};
};