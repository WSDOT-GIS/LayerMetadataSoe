/*globals jQuery, dojo, esri, test, equal, module, notEqual, start, ok, raises, asyncTest */

/**
* Make a copy of this file called unittest.js and modify the URLs to match those of the web service you will be testing with.
*/

(function($) {
	"use strict";
	
	var mapServiceUrl, featureLayerId, featureLayerUrl;
	mapServiceUrl = "http://YourServer/ArcGIS/rest/services/YourMap/MapServer";
	featureLayerId = 0;
	featureLayerUrl = [mapServiceUrl, featureLayerId].join("/"); 
	
	function performTests() {
		var expected; 
		expected = mapServiceUrl + "/exts/LayerMetadata/metadata/" + String(featureLayerId);
		module("URL tests");
		
		test("get metadata url from map service url", function(){
			var metadataUrl = esri.layers.getMetadataUrl(mapServiceUrl, featureLayerId);
			equal(metadataUrl, expected, "The returned metadata URL matches the expected metadata URL.");
		});
		
		test("Get URL for list of feature layers", function(){
			var outputUrl = esri.layers.getLayersWithMetadataUrl(mapServiceUrl);
			equal(outputUrl, mapServiceUrl + "/exts/LayerMetadata/validLayers", "The returned URL matches the expected URL.");
		});
		
		module("Layer instance tests.");

		test("Get metadata URL from tiled map service layer object", function() {
			var metadataUrl, layer;
			layer = new esri.layers.ArcGISTiledMapServiceLayer(mapServiceUrl);
			metadataUrl = layer.getMetadataUrl(featureLayerId);
			equal(metadataUrl, expected, "The returned metadata URL matches the expected metadata URL.");
		});
		
		test("Get metadata URL from dynamic map service layer object", function() {
			var metadataUrl, layer;
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			metadataUrl = layer.getMetadataUrl(featureLayerId);
			equal(metadataUrl, expected, "The returned metadata URL matches the expected metadata URL.");
		});

		test("Get meatadata URL from feature layer object", function(){
			var metadataUrl, layer;
			layer = new esri.layers.FeatureLayer(featureLayerUrl);
			metadataUrl = layer.getMetadataUrl();
			equal(metadataUrl, mapServiceUrl + "/exts/LayerMetadata/metadata/" + String(featureLayerId), "The returned metadata URL matches the expected metadata URL.");
		});
		
		
		module("SOE query test");
		
		asyncTest("getIdsOfLayersWithMetadata test", function() {
			
			/**
			 * Checks to make sure all of the elements in an array are numbers.
			 * @param {Array}
			 */
			function arrayContainsOnlyNumbers(data) {
				for(var i = 0, l = data.length; i < l; i++){
					if (typeof(data[i]) !== "number") {
						return false;
					}
				}
				return true;
			}
			
			var layer;
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			layer.getIdsOfLayersWithMetadata(function(data){
				ok(dojo.isArray(data), "Result is an array.");
				ok(arrayContainsOnlyNumbers(data), "Array contains only numbers.");
				start();
			}, function(error){
				ok(false, "Call to Layer Metadata SOE failed.  Make sure that  " + mapServiceUrl + " has the \"Layer Metadata\" capability turned on.");
				start();
			});
		});

	}
	
	$(document).ready(function(){
		dojo.addOnLoad(performTests);
	});
}(jQuery));	