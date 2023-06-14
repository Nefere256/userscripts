// ==UserScript==
// @name         Tag counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add tags counter to list of entries. Great for MFC editors!
// @author       Nefere
// @match        https://myfigurecollection.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myfigurecollection.net
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

(async function() {
    'use strict';
    var TAG_CLASSNAME = "us-tag";
    var FAKE_CLASS_PLACEHOLDER = "what-i-was-looking-for";
	var REQUEST_DELAY = 1000;
	var CACHE_FRESH_SECONDS = 10 * 60;
	var CACHE_SAVE_AFTER_SETTING_VALUES_ORDER = 5;
	var CACHE_SAVE_AFTER_SETTING_VALUES_ORDER_COUNTER = 0;
	var tagCounterCache = new Map(Object.entries(
	JSON.parse(await GM.getValue('tagCounterCache', '{}'))));
	
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};
	function pushToTagCounterCache(url, tagCounter) {
		if (tagCounter) {
			var time = Date.now();
			tagCounterCache.set(url, {'number': tagCounter, 'updatedTime': time});	
			CACHE_SAVE_AFTER_SETTING_VALUES_ORDER_COUNTER++;
			if (CACHE_SAVE_AFTER_SETTING_VALUES_ORDER_COUNTER % CACHE_SAVE_AFTER_SETTING_VALUES_ORDER == 0) {
				GM.setValue('tagCounterCache', JSON.stringify(Object.fromEntries(tagCounterCache)));
			}
		}
	};
	async function getTagCounterFromTagCounterCache(url) {
		var tagCounterPair = await tagCounterCache.get(url);
		if (tagCounterPair == null) {
			return 0;
		}
		var rottenPairDate = new Date(tagCounterPair.updatedTime);
		rottenPairDate.setSeconds(rottenPairDate.getSeconds() + CACHE_FRESH_SECONDS);
		if ( rottenPairDate < Date.now()) {
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
        if (window.location.pathname.includes("/entry/")) {
            var result = $("#wide .results .result");
            return result;
        }
        console.log("unsupported getEntryContainers");
        return $(FAKE_CLASS_PLACEHOLDER);
    };
    function getItemsFromContainer(entryContainer) {
        var icons = $(entryContainer).find(".item-icons .item-icon");
        if (icons.length > 0) {
            return icons;
        }
        console.log("unsupported getItemsFromContainer");
        return $(FAKE_CLASS_PLACEHOLDER);
    };
	function getTagCounterFromHtml(html){
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

	async function fetchAndHandle (queue) {
		var resultQueue = [];
		for(var itemElement of queue) {
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
					REQUEST_DELAY = REQUEST_DELAY * 1.1;
					console.info('Increased delay to ' + REQUEST_DELAY);
				}
			});
			await sleep(REQUEST_DELAY);
			
		}
		return resultQueue;
	};
	async function main(){
		var cacheQueue = [];
		var entryContainers = getEntryContainers();
		entryContainers.each(function(i, entryContainer) {
			var itemsElements = getItemsFromContainer(entryContainer);
			itemsElements.each(function(i, itemElement) {
				cacheQueue.push(itemElement);
			});
		});

		var queue = [];

		for(var itemElement of cacheQueue) {
			var itemLinkElement = itemElement.firstChild;
				var entryLink = itemLinkElement.getAttribute("href");
				var cache = await getTagCounterFromTagCounterCache(entryLink);
				if (cache > 0) {
					addTagCounterToSearchResult(itemLinkElement, cache);
				} else {
					queue.push(itemElement);
				}
		}

		while (queue.length) {
			queue = await fetchAndHandle(queue);
		}
		GM.setValue('tagCounterCache', JSON.stringify(Object.fromEntries(tagCounterCache)));

	};
	
	addStyles();
	main();
})();