using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using ESRI.ArcGIS.SOESupport;

// General Information about an assembly is controlled through the following 
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("LayerMetadata")]
[assembly: AssemblyDescription("A server object extension for ArcGIS Server that provides access to the metadata of a map services' layers.")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("Washington State Department of Transportation")]
[assembly: AssemblyProduct("LayerMetadata")]
[assembly: AssemblyCopyright("Unlicense")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("en-US")]

// Setting ComVisible to false makes the types in this assembly not visible 
// to COM components.  If you need to access a type in this assembly from 
// COM, set the ComVisible attribute to true on that type.
[assembly: ComVisible(false)]

// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("3e84aef8-b73c-49d8-bb58-266017ee9bd4")]

// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version 
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Build and Revision Numbers 
// by using the '*' as shown below:
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("2.0.0.0")]
[assembly: AssemblyFileVersion("2.0.0.0")]

[assembly: AddInPackage("LayerMetadata", "b75a60f0-e573-45b3-9d40-eb54f1305dc0",
	Author = "Jeff Jacobson",
	Company = "Washington State Department of Transportation",
	Date = "12/25/2018 12:00:00 AM",
	Description = "Provides the ability to access metadata of layer data sources.",
	TargetProduct = "Server",
	TargetVersion = "10.6",
	Version = "2.0")]
