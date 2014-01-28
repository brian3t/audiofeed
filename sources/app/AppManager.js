﻿/**
* 
* @file AppManager.js
* @fileOverview 
* File containing the implementation of the AppManager singleton.
* 
* @author Abalta Technologies, Inc.
* @date April, 2013
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
* @namespace Namespace for the application specific classes.
*/
window.sportsnewsfeedapp.app = window.sportsnewsfeedapp.app || {};

/**
* Creates the singleton AppManager.
* @class Represents the singleton AppManager. AppManager is responsible to initialize all other managers in the proper order.
* @param undefined Parameter is not passed to obtain the generic javascript undefined type.
*/
window.sportsnewsfeedapp.app.AppManager = (function (undefined) {

    /** 
    * @exports instance as window.sampleapp.app.AppManager 
    * @ignore 
    */
    var instance = {};

    /**
    * Initializes all managers in the right order.
    */
    instance.init = function() {
    	window.sportsnewsfeedapp.helper.HelperHolder.init();
        window.sportsnewsfeedapp.services.ServiceManager.init();
        window.sportsnewsfeedapp.models.ModelManager.init();
        window.sportsnewsfeedapp.controllers.ControllerManager.init();
    };

    return instance;
})();

