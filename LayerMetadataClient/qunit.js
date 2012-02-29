/*globals jQuery, dojo, esri, test, equal, module, notEqual, start, ok, raises, asyncTest */
(function($) {
	"use strict";
	
	var mapServiceUrl, featureLayerUrl;
	mapServiceUrl = "http://hqolymgis21t/ArcGIS/rest/services/Shared/CityLimits/MapServer";
	featureLayerUrl = "http://hqolymgis21t/ArcGIS/rest/services/Shared/CityLimits/MapServer/0";
	
	function performTests() {
		module("URL tests");

		test("map service test", function() {
			var metadataUrl, layer, expected;
			expected = mapServiceUrl + "/exts/LayerMetadata/metadata/" + "0";
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			metadataUrl = layer.getMetadataUrl(0);
			equal(metadataUrl, expected, "The returned metadata URL matches the expected metadata URL.");
		});

		test("feature service test", function(){
			var metadataUrl, layer;
			layer = new esri.layers.FeatureLayer(featureLayerUrl);
			metadataUrl = layer.getMetadataUrl();
			equal(metadataUrl, mapServiceUrl + "/exts/LayerMetadata/metadata/" + "0", "The returned metadata URL matches the expected metadata URL.");
		});
		
		
		module("SOE query test");
		
		asyncTest("getIdsOfLayersWithMetadata test", function() {
			
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