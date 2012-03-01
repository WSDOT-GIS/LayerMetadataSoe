/*jslint devel: true, browser: true, white: true */
/*globals jQuery, dojo, esri, test, equal, module, notEqual, start, ok, raises, asyncTest */

/**
* Make a copy of this file called unittest.js and modify the URLs to match those of the web service you will be testing with.
*/

(function ($) {
	"use strict";
	
	var mapServiceUrl, featureLayerId, featureLayerUrl;
	mapServiceUrl = "http://YourServer/ArcGIS/rest/services/YourMap/MapServer";
	featureLayerId = 0;
	featureLayerUrl = [mapServiceUrl, featureLayerId].join("/"); 
	
	function performTests() {
		var expected; 
		expected = mapServiceUrl + "/exts/LayerMetadata/metadata/" + String(featureLayerId);
		module("URL tests");
		
		test("get metadata url from map service url", function () {
			var metadataUrl = esri.layers.getMetadataUrl(mapServiceUrl, featureLayerId);
			equal(metadataUrl, expected, "The returned metadata URL matches the expected metadata URL.");
		});
		
		test("Get URL for list of feature layers", function () {
			var outputUrl = esri.layers.getLayersWithMetadataUrl(mapServiceUrl);
			equal(outputUrl, mapServiceUrl + "/exts/LayerMetadata/validLayers", "The returned URL matches the expected URL.");
		});
		
		module("Layer instance tests.");

		test("Get metadata URL from tiled map service layer object", function () {
			var metadataUrl, layer;
			layer = new esri.layers.ArcGISTiledMapServiceLayer(mapServiceUrl);
			metadataUrl = layer.getMetadataUrl(featureLayerId);
			equal(metadataUrl, expected, "The returned metadata URL matches the expected metadata URL.");
		});
		
		test("Get metadata URL from dynamic map service layer object", function () {
			var metadataUrl, layer;
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			metadataUrl = layer.getMetadataUrl(featureLayerId);
			equal(metadataUrl, expected, "The returned metadata URL matches the expected metadata URL.");
		});

		test("Get meatadata URL from feature layer object", function () {
			var metadataUrl, layer;
			layer = new esri.layers.FeatureLayer(featureLayerUrl);
			metadataUrl = layer.getMetadataUrl();
			equal(metadataUrl, mapServiceUrl + "/exts/LayerMetadata/metadata/" + String(featureLayerId), "The returned metadata URL matches the expected metadata URL.");
		});
		
		
		module("SOE query test");
		
		asyncTest("getIdsOfLayersWithMetadata test", function () {
			
			/**
			 * Checks to make sure all of the elements in an array are numbers.
			 * @param {Array}
			 */
			function arrayContainsOnlyNumbers(data) {
				var i, l;
				for (i = 0, l = data.length; i < l; i += 1) {
					if (typeof(data[i]) !== "number") {
						return false;
					}
				}
				return true;
			}
			
			var layer;
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			layer.getIdsOfLayersWithMetadata(function (data) {
				ok(dojo.isArray(data), "Result is an array.");
				ok(arrayContainsOnlyNumbers(data), "Array contains only numbers.");
				start();
			}, function (error) {
				ok(false, "Call to Layer Metadata SOE failed.  Make sure that  " + mapServiceUrl + " has the \"Layer Metadata\" capability turned on.\n" + error);
				start();
			});
		});
		
		module("Metadata support check");
		
		asyncTest("Check layer for metadata", function () {
			var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			layer.supportsMetadata(function () {
				ok(true, mapServiceUrl + " supports metadata.");
				start(); 
			}, function () {
				ok(false, mapServiceUrl + " reports that it does not support metadata, but it does.");
				start();
			});
		});
		
		asyncTest("Check layer without metadata SOE for metadata", function () {
			var url = "http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer";
			var layer = new esri.layers.supportsMetadata(url, function () {
				ok(false, "The metdata support method reports that " + url + " supports metadata.  This is one of ESRI's services, so it probably does not have our custom SOE installed.");
				start(); 
			}, function () {
				ok(true, "As expected, " + url + " does not support metadata.");
				start();
			});
		});
		
		module("Metadata document retrieval");
		
		asyncTest("Get metadata as XML", function () {
			// Use the "expected" URL to query for metadata documents.
			var xhrArgs = {
				url: expected,
				content: {
					f: "xml"
				},
				headers: {
					"X-Requested-With": null
				},
				handleAs: "xml",
				load: function (xmlDocument, ioArgs) {
					console.debug({"Metadata XML": xmlDocument});
					ok(xmlDocument, "Metadata XML document was retrieved.  See console for more details.");
					start();
				},
				error: function (error, ioArgs) {
					console.debug(error);
					ok(false, error + 'CORS must be enabled on the server in order for this test to pass.');
					start();
				}
			};
			
			dojo.xhrGet(xhrArgs);
		});
		
		asyncTest("Get metadata as HTML", function () {
			// Use the "expected" URL to query for metadata documents.
			var xhrArgs = {
				url: expected,
				content: {
					f: "html"
				},
				headers: {
					"X-Requested-With": null
				},
				// handleAs: "text/html",
				load: function (data, ioArgs) {
					console.debug("HTML", data);
					ok(data, "Metadata HTML document was retrieved.  See console for more details.");
					start();
				},
				error: function (error, ioArgs) {
					console.debug(error);
					ok(false, error + 'CORS must be enabled on the server in order for this test to pass.');
					start();
				}
			};
			
			dojo.xhrGet(xhrArgs);
		});

	}
	
	$(document).ready(function () {
		dojo.addOnLoad(performTests);
	});
}(jQuery));	