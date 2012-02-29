# Layer Metadata Server Object Extension #

This project is an ArcGIS Server Object Extension (SOE) that allows a map service to publish the metadata for its individual layers to the user.

## License ##
This program is licensed under the [MIT license](http://www.opensource.org/licenses/MIT)

## Prerequisites ##

* ArcGIS Server
* Microsoft .NET Framework 3.5

## Compilation ##

### Requirements ###

* Microsoft Visual Studio 2010.
* ArcGIS ArcObjects SDK (for ArcGIS version 10 or higher).

### Instructions ###

1. Open the solution file in Visual Studio 2010.
2. Build the solution.  The compiled output for the SOE and installation program will be written to the bin folder.

## Registering the SOE ##

Note that in order to install the server object extension you must be an administrator on the ArcGIS Server.

1.  Copy the contents of the `bin` folder to a location on the ArcGIS Server.
2.	Run `Register.cmd`. This will perform the COM registration.
3.	Run `RegisterSOE.exe`. This will register the SOE with the ArcGIS Server.

### Setting up a map service to use the SOE ###

1.	Open up the ArcGIS Server manager page. The URL will be `http://<Your Server Name>/ArcGIS/Manager`.
2.	Log in
3.	Create a new map service or edit an existing map service definition.
4.	In the capabilities tab, check the "Layer Metadata" capability

## Uninstalling the SOE ##

1.	Stop any map services that use the Layer Metadata server object extension.
2.	Run `RegisterSOE.exe /u`.
3.	Run `Unregister.cmd`.

## Usage ##

### validLayers ###
Retrieves a an array of of layer ids.

http://*YourServer*/ArcGIS/rest/services/*YourMap*/MapServer/exts/LayerMetadata/validLayers?f=json

#### Parameters ####
* f: Options are `json` and `pjson`.

### metadata ###

Retrieves the metadata document for the specified layer.

http://*YourServer*/ArcGis/rest/services/*YourMap*/MapServer/exts/LayerMetadata/metadata/__layerId__/?f=__format__

#### Parameters ####
* layerId: An integer corresponding to a feature layer ID in the map service.
* f: The output format.  Valid options are `xml` and `html`.

### getMetadata ###
Retrieves the metadata document for the specified layer.

http://*YourServer*/ArcGIS/rest/services/*YourMap*/MapServer/exts/LayerMetadata/getMetadata?layer=__layer__&f=__format__

#### Parameters ####
* layer: An integer corresponding to a feature layer ID in the map service.
* f: The output format.  Valid options are `xml` and `html`.

## Projects ##

### LayerMetadata ###

This project is the actual Server Object Extension (SOE).

### RegisterSOE ###

This program is used to register an SOE with ArcGIS Server.  It can work with any ArcGIS Server SOE assembly provided you change the application configuration file.

### LayerMetadataClient ###

This project contains extensions to the [ArcGIS JavaScript API](http://links.esri.com/javascript) layer classes that allow them to call the Layer Metadata SOE.

#### metadataExtensions.js ####

This JavaScript file extends the layer classes to add methods for calling the Layer Metadata SOE.

#### unittest.html ####

QUnit unit test for metadataExtensions.


##### Unit Test Setup #####

1. Copy `unittest.js.sample` to `unittest.js`.  (`unittest.js` is in the `.gitignore` file, so it will not be pushed to the repository.)
2. Modify the url variable in `unittest.js` so that it points to a map service that has the _Layer Metadata_ capability enabled.


## Troubleshooting ##

### I have registered the SOE, but it is not showing up in the list of capabilities in ArcGIS Server Manager.  It does show up in ArcCatalog, though. ###

Restart IIS on the ArcGIS Server.


## F. A. Q. ##

### ArcGIS Server 10.1 is going to have metadata capabilities.  Aren't you wasting your time writing this? ###

After looking at a beta ArcGIS Server 10.1 server and examining its map services, it appears that version 10.1 only adds the ability to publish a single metadata document per map service.

What this SOE will do is pubish one metadata document for each LAYER in a map service.