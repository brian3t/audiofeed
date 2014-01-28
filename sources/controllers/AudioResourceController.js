/**
 * 
 * @file AudioResourceController.js
 * @fileOverview 
 * File containing the implementation of the sportsnewsfeedController singleton.
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
ns_controllers.AudioResourceController = (function(undefined) {

    /**
     * @exports instance as
     *          window.sportsnewsfeedapp.controllers.sportsnewsfeedController
     * @ignore
     */
    var instance = {
        // constants
        FOO: 100
    };

    /**
     * Holds the AudioResouce retrieved by the AudioResouceModel: {
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
     * audioResourceModel when requesting data.
     */
    instance.audioResourceListDataOptions = {
        'isAdhoc': true,
        'paragraphToSpeak': {}
    };

    /**
     * Initializes the AudioResourceController.
     */
    instance.init = function() {

        var playButton = $('#playbutton');
        var stopButton = $('#stopbutton');
        var activityIndicator = $('#activityindicator');
        var textPosition = $('#textposition');

        function onError(error)
        {
            console.log(error.message);
        }

        function onConfirmRetry(button) {
            if (button === 1) {
                html5audio.play();
            }
        }

        function pad2(number) {
            return (number < 10 ? '0' : '') + number;
        }

        var audioUrlList = [];
        var myaudioUrl = '';
        var myaudio = null;
        var isPlaying = false;
        var readyStateInterval = null;
        this.currentIndex = 0;

        this.html5audio = {
            play: function()
            {
                /****
                 * DEBUGGING
                 */
//        instance.audioResourceListData.urlList = [
//            "resources/images/tmp/sound1.mp3",
//        ];
//                        
                isPlaying = true;

                //if first loaded
                if (instance.currentIndex === 0) {
                    myaudio = new Audio(instance.audioResourceListData.urlList[0]);
                }
                myaudio.play();

                readyStateInterval = setInterval(function() {
                    if (myaudio.readyState <= 2) {
                        playButton.hide();
                        activityIndicator.show();
                        textPosition.html('loading...');
                    }
                }, 1000);
                myaudio.addEventListener("timeupdate", function() {
                    var s = parseInt(myaudio.currentTime % 60);
                    var m = parseInt((myaudio.currentTime / 60) % 60);
                    var h = parseInt(((myaudio.currentTime / 60) / 60) % 60);
                    if (isPlaying && myaudio.currentTime > 0) {
                        textPosition.html(pad2(h) + ':' + pad2(m) + ':' + pad2(s));
                    }
                }, false);
                myaudio.addEventListener("error", function() {
                    console.log('myaudio ERROR');
                }, false);
                myaudio.addEventListener("canplay", function() {
                    console.log('myaudio CAN PLAY');
                }, false);
                myaudio.addEventListener("waiting", function() {
                    //console.log('myaudio WAITING');
                    isPlaying = false;
                    playButton.hide();
                    stopButton.hide();
                    activityIndicator.show();
                }, false);
                myaudio.addEventListener("playing", function() {
                    isPlaying = true;
                    playButton.hide();
                    activityIndicator.hide();
                    stopButton.show();
                }, false);
                myaudio.addEventListener("ended", function() {
                    instance.html5audio.stopAndPlayNext();
                }, false);
            },
            pause: function() {
                isPlaying = false;
                clearInterval(readyStateInterval);
                myaudio.pause();
                stopButton.hide();
                activityIndicator.hide();
                playButton.show();
            },
            stopAndPlayNext: function() {
                isPlaying = false;
                clearInterval(readyStateInterval);
                myaudio.pause();
                stopButton.hide();
                activityIndicator.hide();
                playButton.show();
                myaudio = null;

                //play the next URL
                instance.currentIndex = Math.round((instance.currentIndex + 1) % instance.audioResourceListData.urlList.length);
                myaudio = new Audio(instance.audioResourceListData.urlList[instance.currentIndex]);
                isPlaying = false;
                //                disabled because mobile doesn't allow this
                //                instance.html5audio.play();

                textPosition.html('');
            },
            stop: function() {
                if (isPlaying) {
                    isPlaying = false;
                    clearInterval(readyStateInterval);
                    myaudio.pause();
                    stopButton.hide();
                    activityIndicator.hide();
                    playButton.show();
                    myaudio = null;
                    textPosition.html('');
                }
            }
        };
    };

    /**
     * Sets audioresource data
     * @param {} newData new Data
     */
    instance.setAudioResourceListData = function(newData)
    {
        instance.audioResourceListData = newData;
    };

    /*
     * Stop playback
     */

    instance.stopPlayback = function()
    {
        instance.html5audio.stop();
    };

    /*
     * todo: Combines multiple mp3 files into one mp3 file
     */

    return instance;
})();

