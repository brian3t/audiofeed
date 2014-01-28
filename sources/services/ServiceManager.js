/**
 * 
 * @file ServiceManager.js
 * @fileOverview 
 * File containing the implementation of the ServiceManager singleton.
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
 * Creates the singleton ServiceManager.
 * @class Represents the singleton ServiceManager. ServiceManager is responsible to create all necessary services.
 * @param undefined Parameter is not passed to obtain the generic javascript undefined type
 */
window.sportsnewsfeedapp.services.ServiceManager = (function(undefined) {

    /** 
     * @exports instance as window.sportsnewsfeedapp.services.ServiceManager
     * @ignore 
     */
    var instance = {};

    /** 
     * Holds an instance of a sportsnewsfeedService.
     */
    instance.sportsnewsfeedService = null;

    /** 
     * Holds an instance of a sportsnewsfeedService.
     */
    instance.audioResourceService = null;
    

    /**
     * Creates all necessary services.
     */
    instance.init = function() {
//        instance.audioResourceService = new window.sportsnewsfeedapp.services.audioResourceService_GOOGLE();
        instance.audioResourceService = new window.sportsnewsfeedapp.services.audioResourceService_TTSAPI();

        instance.sportsnewsfeedService = new window.sportsnewsfeedapp.services.newsFeedService_ESPN();

    };

    return instance;
})();