using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using ESRI.ArcGIS;
using ESRI.ArcGIS.ADF.Connection.AGS;
using ESRI.ArcGIS.Server;
using RegisterSOE.Properties;

namespace RegisterSOE
{
	class Program
	{
		/// <summary>
		/// Checks whether an extension with the passed-in name is already registered with the passed-in server
		/// </summary>
		/// <param name="serverObjectAdmin">The server object administration object that will be used to check the extension name.</param>
		/// <param name="extensionName">The name of the extension to be checked.</param>
		/// <returns>
		/// Returns <see langword="true"/> if an extension with a name matching <paramref name="extensionName"/> 
		/// is registered with ArcGIS Server, <see langword="false"/> otherwise.
		/// </returns>
		static private bool IsExtensionRegistered(IServerObjectAdmin2 serverObjectAdmin, string extensionName)
		{
			// Get the extensions that extend MapServer server objects
			IEnumServerObjectExtensionType extensionTypes = serverObjectAdmin.GetExtensionTypes("MapServer");
			extensionTypes.Reset();

			// If an extension with a name matching that passed-in is found, return true
			IServerObjectExtensionType extensionType = extensionTypes.Next();
			while (extensionType != null)
			{
				if (extensionType.Name == extensionName)
				{
					return true;
				}

				extensionType = extensionTypes.Next();
			}

			// No matching extension was found, so return false
			return false;
		}

		static int Main(string[] args)
		{
			 Regex 
				helpRegex = new Regex(@"(?in)^((-+)|/)(\?|(h(elp)?))"),
				unregRegex = new Regex(@"(?in)^((-+)|/)u(nregister)?");

			Settings settings = Settings.Default;
			if (args.Length > 0 && args.FirstOrDefault(arg => helpRegex.IsMatch(arg)) != null)
			{
				Console.WriteLine("Registers \"{0}\" as a server object extension on \"{1}\".", settings.SoetName, settings.Host);
				Console.WriteLine("Use the /u flag to unregister \"{0}\".", settings.SoetName);
				return 0;
			}
			try
			{
				RuntimeManager.Bind(ESRI.ArcGIS.ProductCode.Server);
				ESRI.ArcGIS.ADF.Connection.AGS.AGSServerConnection gisconnection = new AGSServerConnection();
				gisconnection.Host = settings.Host;

				gisconnection.Connect();
				IServerObjectAdmin2 soa = (IServerObjectAdmin2)gisconnection.ServerObjectAdmin;


				bool extensionRegistered = IsExtensionRegistered(soa, settings.SoetName);


				if (args.Length > 0 && args.FirstOrDefault(arg => unregRegex.IsMatch(arg)) != null)
				{
					if (extensionRegistered)
					{
						soa.DeleteExtensionType("MapServer", settings.SoetName);
						Console.WriteLine("Unregestered SOE \"{0}\" with ArcGIS Server.", settings.SoetName);
					}
					else
					{
						Console.WriteLine("SOE \"{0}\" not found to be registered with ArcGIS Server.", settings.SoetName);
					}
				}
				else
				{
					if (extensionRegistered)
					{
						Console.WriteLine("SOE \"{0}\" is already registered with ArcGIS Server.", settings.SoetName);
					}
					else
					{
						var soet = (IServerObjectExtensionType3)soa.CreateExtensionType();

						soet.CLSID = settings.SoetClsId;
						soet.Description = settings.SoetDescription;
						soet.DisplayName = settings.SoetDisplayName;
						soet.Name = settings.SoetName;
						////soet.Info.SetProperty("SupportsREST", "true");
						////soet.Info.SetProperty("SupportsMSD", "true");

						if (!string.IsNullOrEmpty(settings.SoetInfo))
						{
							var serializer = new JavaScriptSerializer();
							var soetInfoDict = serializer.Deserialize<Dictionary<string, object>>(settings.SoetInfo);
							foreach (var kvp in soetInfoDict)
							{
								soet.Info.SetProperty(kvp.Key, kvp.Value);
							}
						}

						soa.AddExtensionType("MapServer", soet);
						Console.WriteLine("Registered SOE with ArcGIS Server");

					}
				}
			}
			catch (Exception ex)
			{
				Console.Error.WriteLine(ex.ToString());
				return -1;
			}
			return 0;
		}
	}
}
