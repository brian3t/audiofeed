/**
* 
* @file ModelManager.js
* @fileOverview 
* File containing the implementation of the ModelManager singleton.
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
* Creates the singleton ModelManager.
* @class Represents the singleton ModelManager. ModelManager is responsible to initialize all models.
* @param undefined Parameter is not passed to obtain the generic javascript undefined type
*/
window.sportsnewsfeedapp.models.ModelManager = (function (undefined) {

    /** 
    * @exports instance as window.sportsnewsfeedapp.models.ModelManager
    * @ignore 
    */
    var instance = {};

    /**
    * Initializes all models.
    */
    instance.init = function() {
        window.sportsnewsfeedapp.models.newsFeedModel.init();
        window.sportsnewsfeedapp.models.AudioResourceModel.init();
    };

    return instance;
})();