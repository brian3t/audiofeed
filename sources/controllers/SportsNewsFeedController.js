/**
 * 
 * @file SportsCenterController.js
 * @fileOverview 
 * File containing the implementation of the sportsnewsfeedController singleton.
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
 * @namespace Namespace for the controllers classes.
 */
window.sportsnewsfeedapp.controllers = window.sportsnewsfeedapp.controllers || {};

/**
 * @exports ns_controllers as window.sportsnewsfeedapp.controllers
 */
var ns_controllers = window.sportsnewsfeedapp.controllers;

/**
 * Creates the singleton sportsnewsfeedController.
 * 
 * @class Represents the singleton sportsnewsfeedController.
 * @param undefined
 *            Parameter is not passed to obtain the generic javascript undefined
 *            type
 * @exports ns_controllers as window.sportsnewsfeedapp.controllers
 */
ns_controllers.sportsnewsfeedController = (function(undefined) {

    /**
     * @exports instance as
     *          window.sportsnewsfeedapp.controllers.sportsnewsfeedController
     * @ignore
     */
    var instance = {
        // constants
        API_ITEMS_LIMIT: 100,
        DEMO_SIZE: 10,
        MAX_THUMBNAIL_HEIGHT: 50,
        MAX_THUMBNAIL_WIDTH: 50,
        MENU_ITEM_HEIGHT: 62,
        MENU_MAX_HEIGHT: 430
    };

    var DEFAULT_ZOOM = 12;
    /**
     * Is the controller waiting for new data?
     */
    instance.isWaitingForData = false;

    /**
     * Is the controller going to wait for new data after new page loads?
     */
    instance.isGoingToWaitForData = false;

    /**
     * When did CONTROLLER start waiting for data?
     */
    instance.waitingStartTime = new Date();

    /*
     * Holds the jScrollPaneElements
     */
    instance.jScrollPaneElement = {};
    instance.jScrollPaneDetailElement = {};

    /**
     * Holds the sports news feed list data retrieved by the newsFeedModel.
     */
    instance.sportsNewsFeedListData = null;

    /**
     * Holds the audio resource list data retrieved by the audioResourceModel.
     */
    instance.audioResourceListData = null;

    /**
     * Holds the sport news feeds filter options, to be passed onto newsFeedModel
     * when requesting data.
     */
    instance.sportsNewsFeedListDataOptions = {
        'resource': '', //other values: /top, /popular
        'leagues': "",
        'isAdhoc': true,
        'limit': this.API_ITEMS_LIMIT
    };
    /**
     * Holds the SINGLE sport news feeds filter options, to be passed onto newsFeedModel
     * when requesting data.
     */
    instance.singleSportsNewsFeedDataOptions = {
        'url': ""
    };

    /**
     * Holds the sport news feeds filter options, to be passed onto newsFeedModel
     * when requesting data.
     */
    instance.audioResourceListDataOptions = {
        'isAdhoc': true,
        'paragraphToSpeak': {}
    };

    /**
     * Holds the single sports news feed data retrieved by the newsFeedModel.
     */
    instance.singleSportsNewsFeedData = null;

    /**
     * The listener ID obtained from the sportsnewsfeed model.
     */
    instance.sportsNewsFeedListDataListenerID = null;
    instance.singleSportsNewsFeedDataListenerID = null;

    /**
     * The listener ID obtained from the audioResource model.
     */
    instance.audioResourceListDataListenerID = null;

    /*
     * The UI in which the sportsNewsFeedList data will be displayed.
     */
    instance.newsFeedListDataDisplay = null;

    instance.delayedF = function() {
        // Register for notifications from the newsFeedModel
        instance.sportsNewsFeedListDataListenerID = window.sportsnewsfeedapp.models.newsFeedModel
                .registerSportsNewsFeedListDataListener(this);

        // Calls method of the newsFeedModel which is already created and
        // initialized.

        instance.sportsNewsFeedListData = window.sportsnewsfeedapp.models.newsFeedModel
                .getSportsNewsFeedListData(false);

        $("#channelListScrollBox>ul>li").first().trigger('click');

    };

    /**
     * Initializes the sportsnewsfeedController.
     */
    instance.init = function() {

        instance.waitForData();

        // Initialize data options
        instance.sportsNewsFeedListDataOptions['limit'] = this.API_ITEMS_LIMIT;
        window.sportsnewsfeedapp.models.newsFeedModel
                .setSportsNewsFeedListDataOptions(instance.sportsNewsFeedListDataOptions);

        window.setTimeout(function() {
            instance.delayedF();
        }, 1000);

        // Obtains the sportsNewsFeedListData UI
        instance.newsFeedListDataDisplay = $("#feedList");

        // init html elements
        $(document).bind('pageinit', function() {

            //callback to execute after the page Single feed Detail is transitioned
            $("#feedDetail").on("pageshow", function(event, ui) {
                if (instance.isGoingToWaitForData) {
                    instance.waitForData();
                    // invoke request for single station data. This is ad-hoc invocation

                    window.sportsnewsfeedapp.models.newsFeedModel.getSingleSportsNewsFeedData(instance.singleSportsNewsFeedDataOptions);

                }
                instance.isGoingToWaitForData = false;
            });

            //detail page finishes
            $("#feedDetail").on("pagehide", function(event, ui) {
                ns_controllers.AudioResourceController.stopPlayback();
            });

            //select first channel choice in channel list
            $('#feedListPage').on("pageshow",
                    function(event, ui) {
                        var jScrollPaneApi = instance.jScrollPaneElement.data('jsp');
                        //reinitialise jScrollPane upon page show
                        jScrollPaneApi.reinitialise();

                    });

        });

        /*{[{textToDisplay: "",
         *          value: ""}]} itemList The list of items; each item contains text to display
         *          and value of the list item (similar to checkbox's value) 				
         */
        var itemList = [
            {textToDisplay: "All",
                value: "all"},
            {textToDisplay: "Top Stories",
                value: "top"},
            {textToDisplay: "Most Popular",
                value: "most"},
            {textToDisplay: "Boxing",
                value: "boxing"},
            {textToDisplay: "NCAA",
                value: "college-football"},
            {textToDisplay: "Golf",
                value: "golf"},
            {textToDisplay: "NCAA Men's",
                value: "mens-college-basketball"},
            {textToDisplay: "MLB",
                value: "mlb"},
            {textToDisplay: "MMA",
                value: "mma"},
            {textToDisplay: "NASCAR",
                value: "nascar"},
            {textToDisplay: "NBA",
                value: "nba"},
            {textToDisplay: "NFL",
                value: "nfl"},
            {textToDisplay: "NHL",
                value: "nhl"},
            {textToDisplay: "Olympic",
                value: "olympics"},
            {textToDisplay: "Auto Racing",
                value: "racing"},
            {textToDisplay: "Soccer",
                value: "soccer"},
            {textToDisplay: "Tennis",
                value: "tennis"},
            {textToDisplay: "WNBA",
                value: "wnba"},
            {textToDisplay: "WNCAA",
                value: "womens-college-basketball"}

        ];
        $(".scrollbox-single-scroll").html(window.sportsnewsfeedapp.helper.HelperHolder.generateScrollboxSingleScrollHtml(this.MENU_ITEM_HEIGHT, this.MENU_MAX_HEIGHT, itemList));
        window.sportsnewsfeedapp.helper.HelperHolder.initializeScrollboxSingleScroll();

        instance.initButtons();
        instance.jScrollPaneElement = $("#scrollPane").jScrollPane({
            verticalDragMinHeight: 143,
            verticalDragMaxHeight: 143,
            verticalGutter: 0,
            minStep: 1,
            hideFocus: true,
            showArrows: true,
            contentWidth: 614,
            horizontalDragMaxWidth: 0,
            horizontalGutter: 0,
            maintainPosition: false
        });
        instance.jScrollPaneDetailElement = $("#scrollPaneDetail").jScrollPane({
            verticalDragMinHeight: 143,
            verticalDragMaxHeight: 143,
            verticalGutter: 0,
            minStep: 1,
            hideFocus: true,
            showArrows: true,
            contentWidth: 655,
            horizontalDragMaxWidth: 0,
            horizontalGutter: 0,
            maintainPosition: false
        });

    };

    /*
     * initializes buttons
     */
    instance.initButtons = function() {

        /* functions for feed list page */

        // calling Model to immediately refresh new sport news feeds data
        $("#page-refresh").click(
                function() {
                    instance.sportsNewsFeedListDataOptions['isAdhoc'] = true;
                    window.sportsnewsfeedapp.models.newsFeedModel
                            .setsportsNewsFeedListDataOptions(instance.sportsNewsFeedListDataOptions);
                    window.sportsnewsfeedapp.models.newsFeedModel
                            .resetsportsnewsfeedListDataTimer();
                    window.sportsnewsfeedapp.models.newsFeedModel
                            .refreshsportsnewsfeedData();
                    instance.waitForData();

                });



        $("#channelListScrollBox>ul>li").each(function(index, value) {
            $(this).click(function() {
                //unselect current box
                $("#channelListScrollBox>ul").find(".is-selected").removeClass("is-selected");

                //select this box
                $(this).addClass("is-selected");
                var val = $(this).find(".value").text();
                switch (val)
                {
                    case 'all':
                        instance.sportsNewsFeedListDataOptions.resource = '';
                        instance.sportsNewsFeedListDataOptions.leagues = '';
                        break;
                    case 'top':
                        instance.sportsNewsFeedListDataOptions.resource = 'top';
                        instance.sportsNewsFeedListDataOptions.leagues = '';
                        break;
                    case 'most':
                        instance.sportsNewsFeedListDataOptions.resource = 'popular';
                        instance.sportsNewsFeedListDataOptions.leagues = '';
                        break;
                    default:
                        instance.sportsNewsFeedListDataOptions.resource = '';
                        instance.sportsNewsFeedListDataOptions.leagues = val;
                        break;
                }
                ;
                instance.sportsNewsFeedListDataOptions.isAdhoc = true;
                window.sportsnewsfeedapp.models.newsFeedModel.setSportsNewsFeedListDataOptions(instance.sportsNewsFeedListDataOptions);
                instance.waitForData();
                window.sportsnewsfeedapp.models.newsFeedModel.refreshSportsNewsFeedListData();
            });
        });

        /* functions for station list page */

        /* functions for feed detail page */
//        $("#audioControlButton  button").click(
//                function() {
//
//                    $(".playBack").append('<iframe src=' +  + ' width="80" height="80" seamless></iframe>');
//                });
    };

    /**
     * Method that will be invoked when controller is actively waiting for new
     * data, e.g. when filter option has just been changed or when single
     * station data is not yet available
     * 
     * @returns false if controller is already waiting for new data true if
     *          succeed in entering waiting phase
     */
    instance.waitForData = function() {
        if (instance.isWaitingForData === true) {
            return false;
        }

        $.mobile.loading("show");// show loading
        $("#scrollPane").addClass("dimmed");
        $("#feedContentWrapper").addClass("dimmed");
        //record the time when CONTROLLER started waiting for new data
        instance.waitingStartTime = new Date();

        instance.isWaitingForData = true;
    };

    /**
     * Method that will be invoked when controller wants to stop waiting for new
     * data, e.g. when new data has become available or when controller decides
     * not to
     * 
     * @returns false if controller is not waiting for new data true if succeed
     *          in exiting waiting phase
     */
    instance.stopWaitingForData = function() {
        if (instance.isWaitingForData === false) {
            return false;
        }
        var now = new Date();

        $.mobile.loading("hide");// hide loading
        $("#scrollPane").removeClass("dimmed");
        $("#feedContentWrapper").removeClass("dimmed");


        instance.sportsNewsFeedListDataOptions['isAdhoc'] = false;
        instance.isWaitingForData = false;
    };

    /**
     * Method that will be invoked when a news feed item is clicked. Requests data for the
     * single feed detail page and waits for Model to callback
     * @param {ui} listElement the element that was clicked
     */

    instance.listClickFunction = function(listElement) {
        var list = $(listElement);

        var sportsNewsFeedLinkMobile = list.find('.sportsNewsFeedLinkMobile').text();

        instance.singleSportsNewsFeedDataOptions["url"] = list.find('.sportsNewsFeedLinkMobile').text();

        /*
         * get data from url.
         * 
         */
        // Register for notifications from the GasStationsModel
        instance.singleSportsNewsFeedDataListenerID = window.sportsnewsfeedapp.models.newsFeedModel.registerSingleSportsNewsFeedDataListener(this);
        instance.isGoingToWaitForData = true;

    };


    /**
     * Method that will be invoked as a notification when a new sportsnewsfeed data
     * from SERVICE is obtained. It displays the new sportsnewsfeed data and the
     * timestamp when it is obtained. todo: if timestamp is less than 0:00 ; the
     * value for .lastUpdated is today
     * 
     * @param data
     *            The received new sportsnewsfeed data.
     * @param timestamp
     *            The timestamp when the sportsnewsfeed data is obtained.
     */
    instance.onNewNewsFeedListData = function(data, timestamp) {
        if (data === null) {
            return false;
        }
        var size = data.feed.length;
        console.log("size of news feed list: " + size);
        if (size === 0) {
            return false;
        }

        NewsFeedListItem = function() {
            return $(
                    '<li></li>',
                    {
                        html: ' <div class="padding">' +
                                '     <a href="#feedDetail" data-transition="slidefade">' +
                                '        <div class="contentWrapper">' +
                                '            <div class="sportsNewsFeedImage" ><img alt="alt" src="resources/images/tmp/feedimage.jpg"/></div>' +
                                '            <div class="feedHeadlineContent">' +
                                '               <span class="sportsNewsFeedID"></span>' +
                                '               <span class="sportsNewsFeedLinkMobile"></span>' +
                                '              <p class="sportsNewsFeedHeadline"><span class="sportsNewsFeedCategory"></span>' +
                                '                 ' +
                                '            </p>' +
                                '       </div>' +
                                '         </div>' +
                                '         <div class="sportsNewsFeedUpdated">' +
                                '            <div class="sportsNewsFeedUpdated-padding">' +
                                '               <label></label>' +
                                '          </div>    ' +
                                '     </div>' +
                                '</a>' +
                                '     </div>'
                    });
        };
        /* prepare elements */
        var newsFeedListItemCollection = new Array();

        /** a single sport news feed from ESPN */
        var feedId;
        var hasImage = false;

        var i = 0;
        var numOfValidRecords = 0;
        while ((i < size) && (numOfValidRecords < this.DEMO_SIZE)) {
            var newsFeedListItem = new NewsFeedListItem();
            var aFeed = data['feed'][i];

            sportsNewsFeedID = aFeed['id'];

            //filter out feeds without mobile links
            if ((typeof(aFeed.links.mobile.href) === "undefined") || (aFeed.links.mobile.href === "")) {
                i = i + 1;
                continue;
            }
            //filter out podcast, video and premium links
            if ((aFeed.type === "PodCast")
                    || (aFeed.premium === true)
                    || ((typeof(aFeed.video) !== "undefined") && (aFeed.video.length > 0))
                    ) {
                i = i + 1;
                continue;
            }

            if ((!aFeed.images) || (aFeed.images.length === 0)) {
                newsFeedListItem.find('.sportsNewsFeedImage').remove();
            }
            else {
                //check if size of image is too big

                //normally there is only one image
                imageElement = aFeed['images'][0];
                if ((imageElement.height > this.MAX_THUMBNAIL_HEIGHT) || (imageElement.width > this.MAX_THUMBNAIL_WIDTH)) {
                    newsFeedListItem.find('.sportsNewsFeedImage').remove();
                }
                else {
                    newsFeedListItem.find('.sportsNewsFeedImage img').attr('src', imageElement.url);
                }
                ;
            }
            newsFeedListItem.find('.sportsNewsFeedID').text(aFeed.id);
            newsFeedListItem.find('.sportsNewsFeedLinkMobile').text(aFeed.links.mobile.href);

            if ((typeof(aFeed.section) !== "undefined") && (aFeed.section !== "")) {
                newsFeedListItem.find('.sportsNewsFeedCategory').text(aFeed.section);
            }
            else {
                if ((typeof(aFeed.categories) !== "undefined") && (aFeed.categories.length > 0)) {
                    //takes first category
                    newsFeedListItem.find('.sportsNewsFeedCategory').text(aFeed.categories[0].description);
                }
                ;
            }
            ;

            if ((typeof(aFeed.headline) !== "undefined") && (aFeed.headline !== "")) {
                newsFeedListItem.find('.sportsNewsFeedHeadline').append(aFeed.headline);
            }
            else {
                if ((typeof(aFeed.linkText) !== "undefined") && (aFeed.linkText !== "")) {
                    newsFeedListItem.find('.sportsNewsFeedHeadline').append(aFeed.linkText);
                }
                ;
            }
            ;

            //fix a bug from ESPN side. Their published time seems to be 2 hours ahead of UTC
            publishedTime = new Date(aFeed.published);
            publishedTime.setTime(publishedTime.getTime() - 2 * 60 * 60 * 1000);
            publishedTime = publishedTime.toUTCString();
            newsFeedListItem.find('.sportsNewsFeedUpdated').text(window.sportsnewsfeedapp.helper.HelperHolder.hoursAgoShortFormStringFromDate(publishedTime));

            /* filter out development data from ESPN */
//            if (badData)
//                continue;
//            }
            //else, count a valid record

            numOfValidRecords = numOfValidRecords + 1;

            newsFeedListItemCollection.push(newsFeedListItem);
            i = i + 1;
        }
        //end while loop

        /* update station list */
        instance.newsFeedListDataDisplay.html(newsFeedListItemCollection);

        // refresh station listview
        instance.newsFeedListDataDisplay.listview('refresh');
        var jScrollPaneApi = instance.jScrollPaneElement.data('jsp');
        //reinitialise jScrollPane
        jScrollPaneApi.reinitialise();

        $("li").each(function(index) {

            $(this).click(function() {
                instance.listClickFunction(this);
            });
        });

        if (instance.isWaitingForData) {
            instance.stopWaitingForData();
        }
        return true;
    };

    /**
     * Method that will be invoked as a notification when a new single
     * newsFeed data from ESPN is obtained. It displays the new single
     * sport news feed data and the timestamp when it is obtained.
     * 
     * @param data
     *            The received new singlesportsnewsfeed data.  Model:     
     *              details: {
     * "updated"]);
     "feedContentTitle";
     "feedContentAuthor";
     "feedContentParagraph";   
     * @param timestamp
     *            The timestamp when the singleNewsFeed data is obtained.
     */
    instance.onNewSingleSportsNewsFeedData = function(singleSportsNewsFeedData,
            timestamp) {

        /* updating UI */
        var detailPageHtml = $("#feedContent");

        if ((typeof (singleSportsNewsFeedData["details"]["updated"]) !== "undefined") && (singleSportsNewsFeedData["details"]["updated"] !== null)) {
            detailPageHtml.find("#feedContentUpdated").html(
                    "Updated: " + singleSportsNewsFeedData["details"]["updated"]);
        }
        detailPageHtml.find("#feedContentTitle").html(
                singleSportsNewsFeedData["details"]["feedContentTitle"]);
        if ((typeof (singleSportsNewsFeedData["details"]["feedContentAuthor"]) !== "undefined") && (singleSportsNewsFeedData["details"]["feedContentAuthor"] !== null) && (singleSportsNewsFeedData["details"]["feedContentAuthor"] !== "null")) {
            detailPageHtml.find("#feedContentAuthor").html(
                    singleSportsNewsFeedData["details"]["feedContentAuthor"]);
        }
        if ((typeof (singleSportsNewsFeedData["details"]["feedContentParagraph"]) !== "undefined") && (singleSportsNewsFeedData["details"]["feedContentParagraph"] !== null)) {
            //clean up paragraph, trim and remove leading <br>
            singleSportsNewsFeedData["details"]["feedContentParagraph"] = singleSportsNewsFeedData["details"]["feedContentParagraph"].trim();
            singleSportsNewsFeedData["details"]["feedContentParagraph"] = singleSportsNewsFeedData["details"]["feedContentParagraph"].replace(/(\<br\>)+/, "");
            singleSportsNewsFeedData["details"]["feedContentParagraph"] = singleSportsNewsFeedData["details"]["feedContentParagraph"].replace(/(\<br\>[\s]*)+/g, "<br>");

            var jScrollPaneDetailElementAPI = instance.jScrollPaneDetailElement.data('jsp');
            jScrollPaneDetailElementAPI.getContentPane().html("<ul>" + singleSportsNewsFeedData["details"]["feedContentParagraph"] + "</ul>");
            jScrollPaneDetailElementAPI.reinitialise();
        }
        ;

        instance.stopWaitingForData();

        /* AudioControl Playback - Prepare Audio Controls. Details can be found in document ActivityDiagrams/AD1.doc - */

        //retrieve plain text paragraph, clean up paragraph
        var newsFeedParagraph = jScrollPaneDetailElementAPI.getContentPane().text();
        newsFeedParagraph = String(newsFeedParagraph);

        // Determine if there is something to read aloud
        var hasTextToRead = false;
        //if there is a word
        if (newsFeedParagraph.search(/.+ /g) !== -1) {
            hasTextToRead = true;
        }
        ;
        if (!hasTextToRead) {
            return false;
        }
        ;

        //prepare audio controls
        // Register for notifications from the newsFeedModel
        instance.audioResourceListDataListenerID = window.sportsnewsfeedapp.models.AudioResourceModel.registerAudioResourceListDataListener(this);

        //set options
        instance.audioResourceListDataOptions.paragraphToSpeak = newsFeedParagraph;
        window.sportsnewsfeedapp.models.AudioResourceModel.setAudioResourceListDataOptions(instance.audioResourceListDataOptions);

        // Calls method of the newsFeedModel which is already created and
        // initialized.

        instance.audioResourceListData = window.sportsnewsfeedapp.models.AudioResourceModel.getAudioResourceListData(false);


    };

    /**
     * Method that will be invoked as a notification when a new audio resource data
     * from SERVICE is obtained. Enables audio control
     * 
     * @param {} data
     *            The received new audio resource data.
     *            {
     *                   * Holds the AudioResouce retrieved by the AudioResouceService. Model: {
     'urlList': [],
     'type': 'mp3',
     'isRemote': true,
     'originalText': ""
     * @param timestamp
     *            The timestamp when the audio resource data is obtained.
     */
    instance.onNewAudioResourceListData = function(data, timestamp) {
        if (data === null) {
            return false;
        }
        if (data.urlList.length === 0) {
            return false;
        }

        //set source
        ns_controllers.AudioResourceController.setAudioResourceListData(data);


        //unregister listener
        ns_models.AudioResourceModel.unregisterAudioResourceListDataListener(instance.audioResourceListDataListenerID);
    };


    return instance;
})();