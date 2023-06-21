// ==UserScript==
// @name         MFC tag counter
// @namespace    https://takkkane.tumblr.com/scripts/mfcTagCounter
// @version      0.1.2
// @downloadURL	https://raw.githubusercontent.com/Nefere256/userscripts/master/mfc/tagCounter.user.js
// @description  Adds tags count indicator to list of entries
// @author       Nefere
// @supportURL   https://twitter.com/TaxDelusion
// @match        https://myfigurecollection.net/entry/*
// @match        https://myfigurecollection.net/browse.v4.php*
// @match        https://myfigurecollection.net/browse/calendar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myfigurecollection.net
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

(async function () {
    'use strict';

    /**
     * Name of the class used for a tag indicator container.
     * It should be not used on the page it's inserted to.
     **/
    var TAG_CLASSNAME = "us-tag";

    /**
     * Name of the class that does not appear on the page.
     * Used to return empty collections of nodes from functions.
     **/
    var FAKE_CLASS_PLACEHOLDER = "what-i-was-looking-for";

    /**
     * A time in miliseconds to wait between requests for /entry pages.
     * Too short time may results in "429 - Too many requests" error responses.
     * Can be increased with REQUEST_DELAY_MULTIPLIER.
     **/
    var REQUEST_DELAY = 1000;

    /**
     * A multipler that is used on REQUEST_DELAY when 429 response error is obtained.
     * Should be over 1 to properly work.
     **/
    var REQUEST_DELAY_MULTIPLIER = 1.1;

    /**
     * A time in seconds for how long the entry data saved in a cache is considered "fresh" and up to date.
     * After the entry data is "rotten", it is removed from cache and may be replaced with new data.
     **/
    var CACHE_FRESH_SECONDS = 10 * 60;

    /**
     * Map entries for tagCounterCache that are yest to be persisted in the extension storage.
     **/
    var CACHE_SAVE_ENTRIES = [];

    /**
     * How many entries have to be added to the cache so the cache can be persisted in the extension storage.
     * It requires using GM.getValue() and GM.setValue()
     **/
    var CACHE_SAVE_AFTER_SETTING_VALUES_ORDER = 5;

    /**
     * A cache for tag count indicated in the entry page.
     * It's a Map() consisted of:
     * * keys: pathname of an entry page ("/entry/2")
     * * values: object with fields:
     * ** number: integer with number of tags on the entry page (24)
     * ** updatedTime: timestamp of when the map was updated.
     * Map entries may be deleted after time indicated in CACHE_FRESH_SECONDS.
     **/
    var tagCounterCache;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    async function getTagCounterCache() {
        return new Map(Object.entries(
                JSON.parse(await GM.getValue('tagCounterCache', '{}'))));
    };
    async function saveTagCounterCache() {
        var newTagCounterCache = await getTagCounterCache();
        for (var entry of CACHE_SAVE_ENTRIES) {
            newTagCounterCache.set(entry.key, entry.value);
        }
        GM.setValue('tagCounterCache', JSON.stringify(Object.fromEntries(newTagCounterCache)));
        tagCounterCache = newTagCounterCache;
    };
    async function pushToTagCounterCache(url, tagCounter) {
        if (tagCounter) {
            var time = Date.now();
            var entry = {
                key: url,
                value: {
                    'number': tagCounter,
                    'updatedTime': time
                }
            };
            tagCounterCache.set(entry.key, entry.value);
            CACHE_SAVE_ENTRIES.push(entry);
            if (CACHE_SAVE_ENTRIES.length % CACHE_SAVE_AFTER_SETTING_VALUES_ORDER == 0) {
                saveTagCounterCache();
            }
        }
    };
    function getTagCounterFromTagCounterCache(url) {
        var tagCounterPair = tagCounterCache.get(url);
        if (tagCounterPair == null) {
            return 0;
        }
        var rottenPairDate = new Date(tagCounterPair.updatedTime);
        rottenPairDate.setSeconds(rottenPairDate.getSeconds() + CACHE_FRESH_SECONDS);
        if (rottenPairDate < Date.now()) {
            tagCounterCache.delete(url);
            return 0;
        }
        return tagCounterPair.number;
    };
    function addStyles() {
        $("<style>")
        .prop("type", "text/css")
        .html("\
            .item-icon ." + TAG_CLASSNAME + " {\
            position: absolute;\
            display: block;\
            right: 1px;\
            bottom: 1px;\
            height: 16px;\
            padding: 0 4px;\
            font-weight: 700;\
            color: gold;\
            background-color: darkgreen\
            }")
        .appendTo("head");
    };
    function getEntryContainers() {
        var pathname = window.location.pathname;
        if (pathname.includes("/entry/") /* encyclopedia entry */
             || pathname.includes("/browse.v4.php") /* search results with filters */
             || pathname.includes("/browse/calendar/") /* calendar page */) {
            var result = $("#wide .result");
            return result;
        }
        console.log("unsupported getEntryContainers");
        return $(FAKE_CLASS_PLACEHOLDER);
    };
    function isDetailedList() {
        var search = window.location.search;
        var searchParams = new URLSearchParams(search);
        var outputParam = searchParams.get("output"); /* 0 - detailedList, 1,2 - grid, 3 - diaporama */
        return outputParam == 0;
    };
    function getItemsFromContainer(entryContainer) {
        var icons = $(entryContainer).find(".item-icons .item-icon");
        if (icons.length > 0) {
            return icons;
        }
        var pathname = window.location.pathname;
        if (pathname.includes("/browse.v4.php") /* search page, detailed list view */
             && isDetailedList()) {
            return $(FAKE_CLASS_PLACEHOLDER);
        }
        console.log("unsupported getItemsFromContainer");
        return $(FAKE_CLASS_PLACEHOLDER);
    };
    function getTagCounterFromHtml(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var tagCounterNode = doc.querySelector('.tbx-target-TAGS .count');
        return tagCounterNode.textContent;
    };
    function addTagCounterToSearchResult(itemLinkElement, countOfTags) {
        var tagElement = document.createElement("span");
        tagElement.setAttribute("class", TAG_CLASSNAME);
        tagElement.textContent = countOfTags;
        itemLinkElement.appendChild(tagElement);
    };

    async function fetchAndHandle(queue) {
        var resultQueue = [];
        for (var itemElement of queue) {
            var itemLinkElement = itemElement.firstChild;
            var entryLink = itemLinkElement.getAttribute("href");

            fetch(entryLink).then(function (response) {
                if (response.ok) {
                    return response.text();
                }
                return Promise.reject(response);
            }).then(function (html) {
                var countOfTags = getTagCounterFromHtml(html);
                addTagCounterToSearchResult(itemLinkElement, countOfTags);
                pushToTagCounterCache(entryLink, countOfTags);
            }).catch(function (err) {
                if (err.status == 429) {
                    console.warn('Too many requests. Added the request to fetch later', err.url);
                    resultQueue.push(itemElement);
                    REQUEST_DELAY = REQUEST_DELAY * REQUEST_DELAY_MULTIPLIER;
                    console.info('Increased delay to ' + REQUEST_DELAY);
                }
            });
            await sleep(REQUEST_DELAY);

        }
        return resultQueue;
    };
    async function main() {
        var cacheQueue = [];
        var entryContainers = getEntryContainers();
        entryContainers.each(function (i, entryContainer) {
            var itemsElements = getItemsFromContainer(entryContainer);
            itemsElements.each(function (i, itemElement) {
                cacheQueue.push(itemElement);
            });
        });

        var queue = [];
        tagCounterCache = await getTagCounterCache();
        for (var itemElement of cacheQueue) {
            var itemLinkElement = itemElement.firstChild;
            var entryLink = itemLinkElement.getAttribute("href");
            var cache = getTagCounterFromTagCounterCache(entryLink);
            if (cache > 0) {
                addTagCounterToSearchResult(itemLinkElement, cache);
            } else {
                queue.push(itemElement);
            }
        }
        while (queue.length) {
            queue = await fetchAndHandle(queue);
        }
        saveTagCounterCache();

    };

    addStyles();
    main();
})();
