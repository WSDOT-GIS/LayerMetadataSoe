/*globals jQuery, dojo, esri, test, equal, module */
(function($) {
	"use strict";
	
	var mapServiceUrl, featureLayerUrl;
	mapServiceUrl = "http://hqolymgis21t/ArcGIS/rest/services/Shared/CityLimits/MapServer";
	featureLayerUrl = "http://hqolymgis21t/ArcGIS/rest/services/Shared/CityLimits/MapServer/0";
	
	function performTests() {
		module("getMetadataUrl");

		test("map service test", function() {
			var metadataUrl, layer, expected;
			expected = mapServiceUrl + "/exts/LayerMetadata/metadata/" + "0";
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			metadataUrl = layer.getMetadataUrl(0);
			equal(metadataUrl, expected);
		});

		test("feature service test", function(){
			var metadataUrl, layer;
			layer = new esri.layers.FeatureLayer(featureLayerUrl);
			metadataUrl = layer.getMetadataUrl();
			equal(metadataUrl, mapServiceUrl + "/exts/LayerMetadata/metadata/" + "0");
		});
		
		
		asyncTest("getIdsOfLayersWithMetadata test", function() {
			
			var layer;
			layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl);
			layer.getIdsOfLayersWithMetadata(function(data){
				notEqual(data, null);
				start();
			}, function(error){
				// console.debug(error);
				// raises(function(){
					// throw(error);
				// }, "error thrown");
				ok(false);
				start();
			});
		});

	}
	
	$(document).ready(function(){
		dojo.addOnLoad(performTests);
	});
}(jQuery));	