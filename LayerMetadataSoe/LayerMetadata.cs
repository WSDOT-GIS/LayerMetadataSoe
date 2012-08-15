using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

using System.Collections.Specialized;

using System.Runtime.InteropServices;

using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Server;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.SOESupport;
using System.Xml;
using System.Xml.Xsl;
using System.IO;
using System.Web.Script.Serialization;
using System.Text.RegularExpressions;
using Wsdot.ArcObjects.Extensions;
using LayerMetadata.Properties;


//TODO: sign the project (project properties > signing tab > sign the assembly)
//      this is strongly suggested if the dll will be registered using regasm.exe <your>.dll /codebase


namespace LayerMetadata
{
	[ComVisible(true)]
	[Guid("98a173ea-63f3-4a71-ad83-2568a43cd9df")]
	[ClassInterface(ClassInterfaceType.None)]
	[ServerObjectExtension("MapServer",
		AllCapabilities = "",
		DefaultCapabilities = "",
		Description = "Provides a map service with the ability to export the metadata associated with its layers.",
		DisplayName = "Layer Metadata",
		Properties = "",
		SupportsREST = true,
		SupportsSOAP = false)]
	public class LayerMetadata : IServerObjectExtension, IObjectConstruct, IRESTRequestHandler
	{
		private string _soe_name;

		private IPropertySet _configProps;
		private IServerObjectHelper _serverObjectHelper;
		private ServerLogger _logger;
		private IRESTRequestHandler _reqHandler;

		public LayerMetadata()
		{
			_soe_name = this.GetType().Name;
			_logger = new ServerLogger();
			_reqHandler = new SoeRestImpl(_soe_name, CreateRestSchema()) as IRESTRequestHandler;
		}

		#region IServerObjectExtension Members

		public void Init(IServerObjectHelper pSOH)
		{
////#if DEBUG
////            System.Diagnostics.Debugger.Launch();
////#endif
			_serverObjectHelper = pSOH;
		}

		public void Shutdown()
		{
		}

		#endregion

		#region IObjectConstruct Members

		public void Construct(IPropertySet props)
		{
			_configProps = props;
		}

		#endregion

		#region IRESTRequestHandler Members

		public string GetSchema()
		{
			return _reqHandler.GetSchema();
		}

		public byte[] HandleRESTRequest(string Capabilities, string resourceName, string operationName, string operationInput, string outputFormat, string requestProperties, out string responseProperties)
		{
			// ArcGIS 10.1 bug workaround.
			GetActualFormat(operationInput, ref outputFormat);

			return _reqHandler.HandleRESTRequest(Capabilities, resourceName, operationName, operationInput, outputFormat, requestProperties, out responseProperties);
		}

		#endregion

		private RestResource CreateRestSchema()
		{
			RestResource rootRes = new RestResource(_soe_name, false, RootResHandler);

			////RestOperation sampleOper = new RestOperation("sampleOperation",
			////                                          new string[] { "parm1", "parm2" },
			////                                          new string[] { "json" },
			////                                          SampleOperHandler);

			////rootRes.operations.Add(sampleOper);

			RestResource metadataListResource = new RestResource("metadata", true, GetMetadataList);

			RestResource validLayersResource = new RestResource("validLayers", false, GetIdsOfLayersThatHaveMetadata);

			RestResource layerSources = new RestResource("layerSources", false, GetLayerSourceDict);

			RestOperation getLayerMetadataOp = new RestOperation("getMetadata",
				new string[] { "layer" },
				new string[] { "xml", "html", "json" },
				GetMetadataForLayer
				);

			rootRes.resources.Add(validLayersResource);
			rootRes.resources.Add(metadataListResource);
			rootRes.resources.Add(layerSources);

			rootRes.operations.Add(getLayerMetadataOp);

			return rootRes;
		}

		private byte[] RootResHandler(NameValueCollection boundVariables, string outputFormat, string requestProperties, out string responseProperties)
		{
			responseProperties = null;

			JsonObject result = new JsonObject();
			////result.AddString("hello", "world");

			return Encoding.UTF8.GetBytes(result.ToJson());
		}

		//metadata/{metadataListID}
		//returns json with simplified layerinfo (name, id, extent)
		private byte[] GetMetadataList(NameValueCollection boundVariables, string outputFormat, string requestProperties, out string responseProperties)
		{
			responseProperties = null;

			//layerID
			int layerID = Convert.ToInt32(boundVariables["metadataID"]);

			//execute
			var xml = GetMetadataXml(layerID);

			if (Regex.IsMatch(outputFormat, @"(?i)html?"))
			{
				// Transform to HTML using XSLT.
				responseProperties = "{\"Content-Type\" : \"text/html\"}";
				return TransformToHtml(xml);
			}
			else if (string.Compare(outputFormat, "xml", true) == 0)
			{
				responseProperties = "{\"Content-Type\" : \"text/xml\"}";
				return Encoding.UTF8.GetBytes(xml);
			}
			else
			{
				responseProperties = "{\"Content-Type\" : \"application/json\"}";
				JsonObject obj = new JsonObject();
				obj.AddString("metadata", xml);
				return Encoding.UTF8.GetBytes(obj.ToJson());
			}
		}

		private byte[] GetMetadataForLayer(NameValueCollection boundVariables,
			JsonObject operationInput,
			string outputFormat,
			string requestProperties,
			out string responseProperties)
		{
			responseProperties = null;

			long? layerId;

			// Throw an exception if a layer ID value was not provided.
			if (!operationInput.TryGetAsLong("layer", out layerId))
			{
				throw new ArgumentNullException("layer", "The \"layer\" parameter cannot be null.");
			}

			int layerIdInt = (int)layerId.Value;
			string xml = GetMetadataXml(layerIdInt);

			if (Regex.IsMatch(outputFormat, @"(?i)html?"))
			{
				// Transform to HTML using XSLT.
				responseProperties = "{\"Content-Type\" : \"text/html\"}";
				return TransformToHtml(xml);
			}
			else if (string.Compare(outputFormat, "xml", true) == 0)
			{
				responseProperties = "{\"Content-Type\" : \"text/xml\"}";
				return Encoding.UTF8.GetBytes(xml);
			}
			else
			{
				responseProperties = "{\"Content-Type\" : \"application/json\"}";
				JsonObject obj = new JsonObject();
				obj.AddString("metadata", xml);
				return Encoding.UTF8.GetBytes(obj.ToJson());
			}

		}

		/// <summary>
		/// Returns a JSON serialized array listing all of the feature layers in the map service, converted to a byte array.
		/// </summary>
		/// <param name="boundVariables">Not used by this method, but required for method signature..</param>
		/// <param name="outputFormat">The only supported format is "json".</param>
		/// <param name="requestProperties">Not used by this method, but required for method signature.</param>
		/// <param name="responseProperties">Not used by this method, but required for method signature</param>
		/// <returns></returns>
		private byte[] GetIdsOfLayersThatHaveMetadata(NameValueCollection boundVariables,
			string outputFormat,
			string requestProperties,
			out string responseProperties)
		{
			responseProperties = null;
			var idArray = GetIdsOfLayersThatHaveMetadata();
			JsonObject output = new JsonObject();
			output.AddArray("layerIds", idArray.Select(i => i as object).ToArray());
			return Encoding.UTF8.GetBytes(output.ToJson());
		}

		private byte[] GetLayerSourceDict(NameValueCollection boundVariables,
			string outputFormat,
			string requestProperties,
			out string responseProperties)
		{
			responseProperties = null;
			var dict = GetDistinctDataSourceInfo();
			var serializer = new JavaScriptSerializer();
			var json = serializer.Serialize(dict);
			return Encoding.UTF8.GetBytes(json);
		}

		/// <summary>
		/// Returns an array of layer IDs.  This list of layer IDs correspond to Feature Layers.
		/// </summary>
		/// <returns>An array of layer ID <see cref="int"/>s.</returns>
		private int[] GetIdsOfLayersThatHaveMetadata()
		{
			var mapServer = (IMapServer3)_serverObjectHelper.ServerObject;
			string defaultMapName = mapServer.DefaultMapName;

			IMapServerInfo3 serverInfo = mapServer.GetServerInfo(defaultMapName) as IMapServerInfo3;
			IMapLayerInfos mapLayerInfos = serverInfo.MapLayerInfos;

			IMapLayerInfo3 layerInfo = null;
			var output = new List<int>(mapLayerInfos.Count);
			for (int i = 0; i < mapLayerInfos.Count; i++)
			{
				layerInfo = mapLayerInfos.get_Element(i) as IMapLayerInfo3;
				if (layerInfo.IsFeatureLayer)
				{
					output.Add(i);
				}
			}

			// Untested.
			////var output = from layerInfo in mapLayerInfos.AsEnumerable()
			////             where layerInfo.IsFeatureLayer
			////             select layerInfo.ID;

			return output.ToArray();
		}

		/// <summary>
		/// Returns a dictionary of feature layer IDs keyed by data source names.
		/// </summary>
		/// <returns>Returns a dictionary of feature layer IDs keyed by data source names.</returns>
		private Dictionary<string, List<int>> GetDistinctDataSourceInfo()
		{
			var mapServer = (IMapServer3)_serverObjectHelper.ServerObject;
			string defaultMapName = mapServer.DefaultMapName;

			var msDataAccess = (IMapServerDataAccess)_serverObjectHelper.ServerObject;

			IMapServerInfo3 serverInfo = mapServer.GetServerInfo(defaultMapName) as IMapServerInfo3;
			IMapLayerInfos mapLayerInfos = serverInfo.MapLayerInfos;

			var output = (from layerInfo in mapLayerInfos.AsEnumerable()
						  where layerInfo.IsFeatureLayer
						  select new
						  {
							  Id = layerInfo.ID,
							  DataSource = ((IDataset)msDataAccess.GetDataSource(defaultMapName, layerInfo.ID)).Name
						  }).GroupBy(a => a.DataSource, a => a.Id).ToDictionary(g => g.Key, g => g.ToList());

			return output;
		}

		private string GetMetadataXml(int layerId)
		{
			var mapServer = (IMapServer3)_serverObjectHelper.ServerObject;
			string defaultMapName = mapServer.DefaultMapName;



			var msDataAccess = (IMapServerDataAccess)_serverObjectHelper.ServerObject;
			IDataset layer = null;

			string xml = null;
			try
			{
				layer = msDataAccess.GetDataSource(defaultMapName, layerId) as IDataset;
			}
#if DEBUG
			catch (NotImplementedException ex)
			{
				var xmlBuilder = new StringBuilder();
				using (XmlWriter xtw = XmlWriter.Create(xmlBuilder))
				{
					xtw.WriteStartDocument();
					xtw.WriteStartElement("error");
					xtw.WriteString("Metadata could not be retrieved for this layer.");
					xtw.WriteStartElement("details");
					xtw.WriteString(ex.ToString());
					xtw.WriteEndElement();
					xtw.WriteEndElement();
					xtw.WriteEndDocument();
				}
				xml = xmlBuilder.ToString();
			}
#else
			catch (NotImplementedException)
			{
				xml = string.Format("<error>Metadata could not be retrieved for this layer.</error>");
			}
#endif

			if (layer != null)
			{
				IMetadata metadata = layer.FullName as IMetadata;
				if (metadata != null)
				{
					IXmlPropertySet2 propSet = metadata.Metadata as IXmlPropertySet2;
					if (propSet != null)
					{
						xml = propSet.GetXml(string.Empty);
					}
				}
			}
			if (string.IsNullOrEmpty(xml))
			{
				xml = "<error>No metadata found for this layer.</error>";
			}
			return xml;
		}

		/// <summary>
		/// Transforms metadata XML into HTML using XSLT.
		/// </summary>
		/// <param name="xml">Metadata XML from a feature layer.</param>
		/// <returns>Returns bytes for the output HTML.</returns>
		private static byte[] TransformToHtml(string xml)
		{
			var xsltDoc = new XmlDocument();
			xsltDoc.LoadXml(Resources.FgdcPlusHtml5);
			var xForm = new XslCompiledTransform();
			xForm.Load(xsltDoc);

			var xmlDoc = new XmlDocument();
			xmlDoc.LoadXml(xml);
			var args = new XsltArgumentList();

			byte[] bytes;
			using (var memStream = new MemoryStream())
			{
				xForm.Transform(xmlDoc, args, memStream);
				bytes = memStream.ToArray();
			}
			return bytes;
		}

		/// <summary>
		/// <para>ArcGIS Server 10.1 introduced a bug that causes the output format to always be set to "json" 
		/// even if another format (e.g., "xml") is specified via the "f" parameter in the HTTP request.
		/// This method reads the "f" parameter from the <paramref name="operationInput"/> and sets the
		/// <paramref name="outputFormat"/> to be the same value as the "f" parameter.</para>
		/// <para>If there is no "f" parameter in <paramref name="operationInput"/> then 
		/// <paramref name="outputFormat"/> will retain its original value.</para>
		/// </summary>
		/// <param name="boundVariables"></param>
		/// <param name="outputFormat"></param>
		/// <example>
		/// <code>
		/// <![CDATA[public byte[] HandleRESTRequest(string Capabilities, string resourceName, string operationName, string operationInput, string outputFormat, string requestProperties, out string responseProperties)
		/// {
		///		// ArcGIS 10.1 bug workaround.
		///		GetActualFormat(operationInput, ref outputFormat);
		///		return _reqHandler.HandleRESTRequest(Capabilities, resourceName, operationName, operationInput, outputFormat, requestProperties, out responseProperties);
		///	}]]>
		/// </code>
		/// </example>
		private void GetActualFormat(string operationInput, ref string outputFormat)
		{
			if (string.IsNullOrEmpty(operationInput)) return;

			var json = new JsonObject(operationInput);
			GetActualFormat(json, ref outputFormat);
		}

		/// <summary>
		/// <para>ArcGIS Server 10.1 introduced a bug that causes the output format to always be set to "json" 
		/// even if another format (e.g., "xml") is specified via the "f" parameter in the HTTP request.
		/// This method reads the "f" parameter from the <paramref name="operationInput"/> and sets the
		/// <paramref name="outputFormat"/> to be the same value as the "f" parameter.</para>
		/// <para>If there is no "f" parameter in <paramref name="operationInput"/> then 
		/// <paramref name="outputFormat"/> will retain its original value.</para>
		/// </summary>
		/// <param name="boundVariables"></param>
		/// <param name="outputFormat"></param>
		/// <example>
		/// <code>
		/// <![CDATA[public byte[] HandleRESTRequest(string Capabilities, string resourceName, string operationName, string operationInput, string outputFormat, string requestProperties, out string responseProperties)
		/// {
		///		// ArcGIS 10.1 bug workaround.
		///		GetActualFormat(operationInput, ref outputFormat);
		///		return _reqHandler.HandleRESTRequest(Capabilities, resourceName, operationName, operationInput, outputFormat, requestProperties, out responseProperties);
		///	}]]>
		/// </code>
		/// </example>
		private void GetActualFormat(JsonObject operationInput, ref string outputFormat)
		{
			string f;
			if (operationInput.TryGetString("f", out f)) 
			{ 
				outputFormat = f;
			}
		}

	}
}
