/**
 * 
 * @file newsFeedModel.js
 * @fileOverview 
 * File containing the implementation of the newsFeedModel singleton.
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
 * @namespace Namespace for the models.
 */
window.sportsnewsfeedapp.models = window.sportsnewsfeedapp.models || {};

/**
 * Creates the singleton newsFeedModel.
 * 
 * @class Represents the singleton newsFeedModel.
 * @param undefined
 *            Parameter is not passed to obtain the generic javascript undefined
 *            type.
 */
window.sportsnewsfeedapp.models.newsFeedModel = (function(undefined) {

    /**
     * @exports instance as window.sportsnewsfeedapp.models.newsFeedModel
     * @ignore
     */
    var instance = {};

    /**
     * Holds the initial data retrieved by the sportsnewsfeedService.
     */
    instance.initialData = null;

    /**
     * Holds the sport news feed list data retrieved by the sportsnewsfeedService. Model: {
     * feed: [             'headline': 'headline',
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
            'published': 'published' ]
     * 
     */
    instance.sportsNewsFeedListData = null;

    /**
     * Holds the sports news feed filter options, to be passed onto
     * sportsnewsfeedService when requesting data.
     */
    instance.sportsNewsFeedListDataOptions = {
        'resource': '', //other values: /top, /popular
        'leagues': '',
        'isAdhoc': true,
        'limit': this.API_ITEMS_LIMIT
    };

    /**
     * Holds the timer interval Id of get Stations Data function
     */
    instance.sportsNewsFeedListDataTimerIntervalId = 0;

    /**
     * Holds the single news feed data retrieved by the sportsnewsfeedService.
     * Model:         details: {
     * "updated"]);
        "feedContentTitle";
        "feedContentAuthor";
        "feedContentParagraph";    
    }
     */
    instance.singleNewsFeedData = null;

    var sportsNewsFeedListDataNotificationList = null; // The notification list for
    // sportsnewsfeed Data listeners

    /**
     * Constants
     */
    this.PAGE_AUTO_REFRESH_INTERVAL = 50000;
    this.API_ITEMS_LIMIT = 100;


    /**
     * Initializes the newsFeedModel.
     */
    instance.init = function() {
        sportsNewsFeedListDataNotificationList = new window.sportsnewsfeedapp.app.NotificationList();
        singleSportsNewsFeedDataNotificationList = new window.sportsnewsfeedapp.app.NotificationList();

        // It is safe to call services here because they are already created.
        instance.initialData = window.sportsnewsfeedapp.services.ServiceManager.sportsnewsfeedService.getInitialData();

        // Start polling data from the sport news feeds service
        instance.sportsNewsFeedListDataTimerInterval = window.setInterval(instance.refreshSportsNewsFeedListData,
                PAGE_AUTO_REFRESH_INTERVAL);

    };


    /**
     * Request sports news feed data from the service and notices listeners
     */
    instance.refreshSportsNewsFeedListData = function() {
        instance.sportsNewsFeedListData = window.sportsnewsfeedapp.services.ServiceManager.sportsnewsfeedService.getSportsNewsFeedListData(instance.sportsNewsFeedListDataOptions);
        var timestamp = new Date();
        var timeString = window.sportsnewsfeedapp.helper.HelperHolder.dateFormatAMPM(timestamp);
//        instance.onNewNewsFeedListData(instance.sportsNewsFeedListData, timeString);
    };



    /**
     * Reset interval timer
     */
    instance.resetSportsNewsFeedListDataTimer = function() {
        window.clearInterval(instance.sportsNewsFeedListDataTimerInterval);
        instance.sportsNewsFeedListDataTimerInterval = window.setInterval(instance.refreshSportsNewsFeedListData,
                PAGE_AUTO_REFRESH_INTERVAL);

    };

    /**
     * Returns the available sport news feeds data.
     * 
     * @param {boolean}
     *            fromCache If true returns the cached data, otherwise calls a
     *            service to obtain it
     * 
     * @returns the sportsnewsfeedData
     */
    instance.getSportsNewsFeedListData = function(fromCache) {
        if (!fromCache) {
            instance.sportsNewsFeedListData = window.sportsnewsfeedapp.services.ServiceManager.sportsnewsfeedService.getSportsNewsFeedListData(instance.sportsNewsFeedListDataOptions);
        }
        return instance.sportsNewsFeedListData;
    };

    /**
     * Sets Adhoc to false. To be called by service after the adhoc request has been fulfilled
     * 
     * @returns {undefined} none
     */
    instance.adHocCompleted = function() {
        this.sportsNewsFeedListDataOptions['isAdhoc'] = false;
    };

    /**
     * Sets Adhoc to true. To be called by CONTROLLER so that the next request will be ad-hoc
     * 
     * @returns {undefined} none
     */
    instance.turnOnAdhoc = function() {
        this.sportsNewsFeedListDataOptions['isAdhoc'] = true;
    };

    /**
     * Request for the available single sport news feed data.
     * 
     * @param 
     * 
     * 			options the options in request url options has {foo: bar
     * 		{boolean} fromCache : If true returns the cached data, otherwise calls
     *            a service to obtain it
     * 
     * @returns if fromCache is true; returns the single Data if
     *          fromCache is false; wait for the SERVICE to callback with a
     *          new data. When data arrives, SERVICE will invoke
     *          MODEL.onNewSingle Data()
     */
    instance.getSingleSportsNewsFeedData = function(options) {
        if (!options['fromCache']) {
            window.sportsnewsfeedapp.services.ServiceManager.sportsnewsfeedService.getSingleSportsNewsFeedData(options);
        }
        return instance.singleSportsNewsFeedData;
    };

    /**
     * Registers listener which will be notified when new sport news feeds _list_ data
     * is obtained.
     * 
     * @param listener
     *            The listener object that will be registered for
     *            notifications.
     * 
     * @returns the ID of the listener.
     */
    instance.registerSportsNewsFeedListDataListener = function(listener) {
        return sportsNewsFeedListDataNotificationList.registerListener(listener);
    };

    /**
     * Registers listener which will be notified when new _single_ sport news feed
     * data is obtained.
     * 
     * @param listener
     *            The listener object that will be registered for
     *            notifications.
     * 
     * @returns the ID of the listener.
     */
    instance.registerSingleSportsNewsFeedDataListener = function(listener) {
        return singleSportsNewsFeedDataNotificationList.registerListener(listener);
    };

    /**
     * Unregisters sport news feeds list data listener by ID.
     * 
     * @param id
     *            The ID of the listener that will be unregistered.
     */
    instance.unregisterSportsNewsFeedListDataListener = function(listenerID) {
        sportsNewsFeedListDataNotificationList.unregisterListener(listenerID);
    };

    /**
     * Unregisters SINGLE sport news feed data listener by ID.
     * 
     * @param id
     *            The ID of the listener that will be unregistered.
     */
    instance.unregisterSingleSportsNewsFeedDataListener = function(listenerID) {
        singleSportsNewsFeedDataNotificationList.unregisterListener(listenerID);
    };

    /**
     * Notifies all listeners for new sport news feeds _list_ data.
     * 
     * @param data
     *            The new sport news feeds data.
     * @param timestamp
     *            The timestamp when the new sport news feeds data is obtained.
     */
    instance.onNewNewsFeedListData = function(data, timestamp) {
        sportsNewsFeedListDataNotificationList.notifyAll("onNewNewsFeedListData", [data, timestamp]);
    };

    /**
     * Notifies all listeners for new SINGLE sport news feed data.
     * 
     * This function can also be called by Service when polling Single gas
     * stations data; so that wait time is minimized
     *  
     * @param data
     *            The new single sport news feed data.
     * @param timestamp
     *            The timestamp when the new sport news feeds data is obtained.
     */
    instance.onNewSingleSportsNewsFeedData = function(data, timestamp) {
        sportsNewsFeedListDataNotificationList.notifyAll("onNewSingleSportsNewsFeedData", [data, timestamp]);
    };

    /**
     * Getters Setters
     */
    instance.getSportsNewsFeedListDataOptions = function() {
        return this.sportsNewsFeedListDataOptions;
    };

    instance.setSportsNewsFeedListDataOptions = function(options) {
        this.sportsNewsFeedListDataOptions = options;
    };

    return instance;

})();