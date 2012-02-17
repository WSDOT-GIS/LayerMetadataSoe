# Layer Metadata Server Object Extension #

This project is an ArcGIS Server Object Extension (SOE) that allows a map service to publish the metadata for its individual layers to the user.

## Status ##

The code for LayerMetadataSoe is still being developed.

## Projects ##

### LayerMetadataSoe ###

This project is the actual Server Object Extension (SOE).

### RegisterSOE ###

This program is used to register an SOE with ArcGIS Server.  It can work with any ArcGIS Server SOE assembly provided you change the application configuration file.

## F. A. Q. ##

### ArcGIS Server 10.1 is going to have metadata capabilities.  Aren't you wasting your time writing this? ###

After looking at a beta ArcGIS Server 10.1 server and examining its map services, it appears that version 10.1 only adds the ability to publish a single metadata document per map service.

What this SOE will do is pubish one metadata document for each LAYER in a map service.