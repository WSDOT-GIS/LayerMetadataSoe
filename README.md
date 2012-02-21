# Layer Metadata Server Object Extension #

This project is an ArcGIS Server Object Extension (SOE) that allows a map service to publish the metadata for its individual layers to the user.

## Prerequisites ##

* ArcGIS Server
* Microsoft .NET Framework 3.5

## Compilation ##

### Requirements ###

* Microsoft Visual Studio 2010.
* ArcGIS ArcObjects SDK.

### Instructions ###

1. Open the solution file in Visual Studio 2010.
2. Build the solution.  The compiled output for the SOE and installation program will be written to the bin folder.

## Registering the SOE ##

Note that in order to install the server object extension you must be an administrator on the ArcGIS Server.

1.	Copy the contents of the bin folder to a location on the ArcGIS Server.
2.	Run `Register.cmd`. This will perform the COM registration.
3.	Run `RegisterSOE.exe`. This will register the SOE with the ArcGIS Server.

### Setting up a map service to use the SOE ###

1.	Open up the ArcGIS Server manager page. The URL will be `http://<Your Server Name>/ArcGIS/Manager`.
2.	Log in
3.	Create a new map service or edit an existing map service definition. The map service must have LRS layers grouped by LRS year. See the example below.
4.	In the capabilities tab, check the "Layer Metadata" capability

#### Example layout ####
* Current
	* Increase
	* Decrease
	* Ramp
*	2010
	* Increase
	* Decrease
	* Ramp
*	2009
	* Increase
	* Decrease
	* Ramp
*	2008
	* Increase
	* Decrease
	* Ramp

## Uninstalling the SOE ##

1.	Stop any map services that use the Layer Metadata server object extension.
2.	Run the following command: `RegisterSOE.exe /u`
3.	Run `Unregister.cmd`




## Projects ##

### LayerMetadataSoe ###

This project is the actual Server Object Extension (SOE).

### RegisterSOE ###

This program is used to register an SOE with ArcGIS Server.  It can work with any ArcGIS Server SOE assembly provided you change the application configuration file.

## F. A. Q. ##

### ArcGIS Server 10.1 is going to have metadata capabilities.  Aren't you wasting your time writing this? ###

After looking at a beta ArcGIS Server 10.1 server and examining its map services, it appears that version 10.1 only adds the ability to publish a single metadata document per map service.

What this SOE will do is pubish one metadata document for each LAYER in a map service.

## License ##
This program is licensed under the [MIT license] (http://www.opensource.org/licenses/MIT)