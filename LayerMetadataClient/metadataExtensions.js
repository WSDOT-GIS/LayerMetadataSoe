/*globals dojo, esri */

// Copyright ©2012 Washington State Department of Transportation (WSDOT).  Released under the MIT license (http://opensource.org/licenses/MIT).

/**
 * This JS file extends the esri.layer.Layers class to provide functions that work with WSDOT's Layer Metadata Server Object Extension (SOE).
 * @author Jeff Jacobson
 */

(function (dojo, esri) {
	"use strict";

	var layerUrlRe = /([\w\d\/\:%]+\/MapServer)(?:\/(\d*))?\/?$/i; // Match results: [full url, map server url, layer id]

	/**
	 * Examines a layer (or a layer URL) and returns the map service url and layer id parts as properties in the returned object.
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object. 
	 * @returns {Object} An object with the properties mapServerUrl and layerId.  mapServerUrl is the url to the map server (without any layerIDs).  layerId is the layer ID portion of the URL.  If the URL did not contain a layerID, this property will have a value of null.
	 */
	function getMapServerUrl(layer) {
		var url, match, output;
		if (typeof (layer) === "string") {
			url = layer;
		} else if (typeof (layer) !== "undefined" && layer !== null && typeof (layer.url) === "string") {
			url = layer.url;
		} else {
			throw new Error("The layer parameter must be either a string or an esri.layers.Layer.");
		}

		match = url.match(layerUrlRe);

		if (match) {
			output = {
				mapServerUrl: match[1],
				layerId: match.length >= 3 && match[2] ? Number(match[2]) : null
			};
			if (isNaN(output.layerId)) {
				output.layerId = null;
			} else {
				return output;
			}
		} else {
			throw new Error("Invalid layer URL format.");
		}
	}
	
	esri.layers.getMapServerUrl = getMapServerUrl;

	/**
	 * Given an esri.layers.Layer object or a layer URL, returns the URL for a query to the Layer Metadata SOE for a list of valid layer IDs. 
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object.
	 * @returns {String} The URL to a query for a list of valid layers. 
	 */
	function getValidLayersUrl(layer) {
		var url = getMapServerUrl(layer); // This will throw an Error if it fails.
		return url.mapServerUrl +  "/exts/LayerMetadata/validLayers";
	}
	
	esri.layers.getLayersWithMetadataUrl = getValidLayersUrl;

	/**
	 * Returns the Layer Metadata SOE URL to retrieve the metadata for a map service feature layer.
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object.
	 * @param {Number} [sublayerId] If the URL provided via the layer parameter does not contain a layer ID, this parameter must be used to supply one.  If the URL already has a layer ID, this parameter will be ignored.
	 * @param {String} [format] The format parameter that will be appended as a query string.  If omitted, no query string will be appended to the URL.
	 */
	function getMetadataUrl(layer, sublayerId, format) {
		var urlInfo = getMapServerUrl(layer), output;
		if (urlInfo.layerId !== null) {
			sublayerId = urlInfo.layerId;
		}
		if (typeof (sublayerId) !== "number") {
			throw new Error("Invalid layer id.  Layer id must be an integer.");
		}
		output = urlInfo.mapServerUrl + "/exts/LayerMetadata/metadata/" + String(sublayerId);

		if (format) {
			output += "?f=" + format;
		}

		return output;
	}
	
	esri.layers.getMetadataUrl = getMetadataUrl;

	/**
	 * Calls the SOE to get the list of layer IDs that correspond to feature layers. 
	 * @param {String|esri.layers.Layer} layer Either a map service or map service layer URL, or an esri.layers.Layer object.
	 * @param {Function} Event handler function that is called when the query is successful.  Parameter "data" is an array of integers.
	 * @param {Function} Event handler function that is called when the query fails.  Parameter "error" is an Error.
	 */
	function getIdsOfLayersWithMetadata(layer, successHandler, failHandler) {
		var jsonpArgs;
		try {
			jsonpArgs = {
				url: getValidLayersUrl(layer),
				callbackParamName: "callback",
				content: {
					"f": "json"
				},
				load: function (data) {
					if (typeof(data.error) !== "undefined" && typeof(failHandler) === "function") {
						failHandler(data.error);
					}
					else if (typeof (successHandler) === "function") {
						successHandler(data);
					}
				},
				error: function (error) {
					if (typeof (failHandler) === "function") {
						failHandler(error);
					}
				}
			};
			return dojo.io.script.get(jsonpArgs);
		} catch (err) {
			if (failHandler) {
				failHandler(err);
			}
		}
	}
	
	esri.layers.getIdsOfLayersWithMetadata = getIdsOfLayersWithMetadata;

	function addExtensions() {
		var i, l, ctor, f, multiLayerClasses = [esri.layers.DynamicMapServiceLayer, esri.layers.ArcGISTiledMapServiceLayer];

		dojo.extend(esri.layers.Layer, {
			getIdsOfLayersWithMetadata: function (successHandler, failHandler) {
				return getIdsOfLayersWithMetadata(this, successHandler, failHandler);
			}
		});

		f = function (layerId, format) {
			return getMetadataUrl(this, layerId, format);
		};

		for (i = 0, l = multiLayerClasses.length; i < l; i += 1) {
			ctor = multiLayerClasses[i];
			dojo.extend(ctor, {
				getMetadataUrl: f
			});
		}
		
		f = function(format) {
			return getMetadataUrl(this, null, format);
		};
		
		dojo.extend(esri.layers.FeatureLayer, {
			getMetadataUrl: f
		});
	}

	dojo.require("dojo.io.script");
	dojo.require("esri.layers.agsdynamic");
	dojo.require("esri.layers.agstiled");
	dojo.require("esri.layers.FeatureLayer");

	dojo.addOnLoad(addExtensions);
}(dojo, esri));
