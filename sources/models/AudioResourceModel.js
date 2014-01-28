/**
 * 
 * @file AudioResouceModel.js
 * @fileOverview 
 * File containing the implementation of the AudioResouceModel singleton.
 * 
 * @author Abalta Technologies, Inc.
 * @date May, 2013
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
 * @exports ns_model as window.sportsnewsfeedapp.models
 */
var ns_models = window.sportsnewsfeedapp.models;

/**
 * Creates the singleton AudioResouceModel.
 * 
 * @class Represents the singleton AudioResouceModel.
 * @param undefined
 *            Parameter is not passed to obtain the generic javascript undefined
 *            type.
 */
window.sportsnewsfeedapp.models.AudioResourceModel = (function(undefined) {

    /**
     * @exports instance as ns_models.AudioResouceModel
     * @ignore
     */
    var instance = {};

    /**
     * Holds the initial data retrieved by the AudioResouceService.
     */
    instance.initialData = null;

    /**
     * Holds the AudioResouce retrieved by the AudioResouceService. Model: {
            'urlList': [],
            'type': 'mp3',
            'isRemote': true,
            'originalText': ""
        }
     * 
     */
    instance.audioResourceListData = null;

    /**
     * Holds the audio Resource options, to be passed onto
     * audioResourceService when requesting data.
     */
    instance.audioResourceListDataOptions = {
        'isAdhoc': true,
        'paragraphToSpeak': {}
    };

    /**
     * Holds the timer interval Id of get resoources Data function
     */
    instance.audioResourceListDataTimerIntervalId = 0;

    var audioResourceListDataNotificationList = null; // The notification list for
    // audioResource Data listeners

    /**
     * Constants
     */
    this.PAGE_AUTO_REFRESH_INTERVAL = 1000000;


    /**
     * Initializes the audioResourceModel.
     */
    instance.init = function() {
        audioResourceListDataNotificationList = new window.sportsnewsfeedapp.app.NotificationList();

        // It is safe to call services here because they are already created.
        instance.initialData = ns_services.ServiceManager.audioResourceService.getInitialData();

        // Start polling data from the audio resource service
//        instance.audioResourceListDataTimerInterval = window.setInterval(instance.refreshAudioResourceListData,
//                PAGE_AUTO_REFRESH_INTERVAL);

    };


    /**
     * Request audio resource data from the service and notices listeners
     */
    instance.refreshAudioResourceListData = function() {
        instance.audioResourceListData = window.sportsnewsfeedapp.services.ServiceManager.audioResourceService.getAudioResourceListData(instance.audioResourceListDataOptions);
        var timestamp = new Date();
        var timeString = window.sportsnewsfeedapp.helper.HelperHolder.dateFormatAMPM(timestamp);
        instance.onNewAudioResourceListData(instance.audioResourceListData, timeString);
    };

    /**
     * Reset interval timer
     */
    instance.resetAudioResourceListDataTimer = function() {
        window.clearInterval(instance.audioResourceListDataTimerInterval);
        instance.audioResourceListDataTimerInterval = window.setInterval(instance.refreshAudioResourceListData,
                PAGE_AUTO_REFRESH_INTERVAL);

    };

    /**
     * Returns the available audio resource data.
     * 
     * @param {boolean}
     *            fromCache If true returns the cached data, otherwise calls a
     *            service to obtain it
     * 
     * @returns the audioResourceData
     */
    instance.getAudioResourceListData = function(fromCache) {
        if (!fromCache) {
            instance.audioResourceListData = ns_services.ServiceManager.audioResourceService.getAudioResourceListData(instance.audioResourceListDataOptions);
        }
        return instance.audioResourceListData;
    };

    /**
     * Sets Adhoc to false. To be called by service after the adhoc request has been fulfilled
     * 
     * @returns {undefined} none
     */
    instance.adHocCompleted = function() {
        this.audioResourceListDataOptions['isAdhoc'] = false;
    };

    /**
     * Sets Adhoc to true. To be called by CONTROLLER so that the next request will be ad-hoc
     * 
     * @returns {undefined} none
     */
    instance.turnOnAdhoc = function() {
        this.audioResourceListDataOptions['isAdhoc'] = true;
    };

    /**
     * Registers listener which will be notified when new audio resource _list_ data
     * is obtained.
     * 
     * @param listener
     *            The listener object that will be registered for
     *            notifications.
     * 
     * @returns the ID of the listener.
     */
    instance.registerAudioResourceListDataListener = function(listener) {
        return audioResourceListDataNotificationList.registerListener(listener);
    };

    /**
     * Unregisters audio resource list data listener by ID.
     * 
     * @param listenerID
     *            The ID of the listener that will be unregistered.
     */
    instance.unregisterAudioResourceListDataListener = function(listenerID) {
        audioResourceListDataNotificationList.unregisterListener(listenerID);
    };

    /**
     * Notifies all listeners for new audio resource _list_ data.
     * 
     * @param data
     *            The new audio resource data.
     * @param timestamp
     *            The timestamp when the new audio resource data is obtained.
     */
    instance.onNewAudioResourceListData = function(data, timestamp) {
        audioResourceListDataNotificationList.notifyAll("onNewAudioResourceListData", [data, timestamp]);
    };

    /**
     * Getters Setters
     */
    instance.getAudioResourceListDataOptions = function() {
        return this.audioResourceListDataOptions;
    };

    instance.setAudioResourceListDataOptions = function(options) {
        this.audioResourceListDataOptions = options;
    };

    return instance;

})();