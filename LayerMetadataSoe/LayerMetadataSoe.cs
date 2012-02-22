using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.EnterpriseServices;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Xsl;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Server;
using ESRI.ArcGIS.SOESupport;
using LayerMetadataSoe.Properties;

namespace LayerMetadataSoe
{
	[ComVisible(true)]
	[Guid("5EEBE41B-6BE7-47FA-B655-31FE26C75562")]
	[ClassInterface(ClassInterfaceType.None)]
	public class LayerMetadataSoe : ServicedComponent, IServerObjectExtension, IObjectConstruct, IRESTRequestHandler
	{
		private IRESTRequestHandler _reqHandler;

		private IServerObjectHelper2 _serverObjectHelper;

		public Dictionary<int, string> Metadata { get; private set; }

		public LayerMetadataSoe()
		{
			RestResource rootResource = CreateRestSchema();
			SoeRestImpl restImpl = new SoeRestImpl("LayerMetadataSoe", rootResource);
			_reqHandler = (IRESTRequestHandler)restImpl;
		}

		public void Init(IServerObjectHelper pSOH)
		{
			_serverObjectHelper = pSOH as IServerObjectHelper2;
		}

		public void Shutdown(){}

		public void Construct(IPropertySet props){}

		private RestResource CreateRestSchema()
		{
			RestResource soeResource = new RestResource("LayerMetadataSoe", false, RootSOE);

			RestResource metadataListResource = new RestResource("metadataList", true, GetMetadataList);

			RestResource validLayersResource = new RestResource("validLayers", false, GetIdsOfLayersThatHaveMetadata);

			RestOperation getLayerMetadataOp = new RestOperation("getLayerMetadata",
				new string[] { "layer" },
				new string[] { "xml", "html" },
				GetMetadataForLayer
				);

			soeResource.operations.Add(getLayerMetadataOp);

			soeResource.resources.Add(validLayersResource);
			soeResource.resources.Add(metadataListResource);
			
			return soeResource;
		}

		public string GetSchema()
		{
			return _reqHandler.GetSchema();
		}

		byte[] IRESTRequestHandler.HandleRESTRequest(string Capabilities, 
			string resourceName, 
			string operationName, 
			string operationInput, 
			string outputFormat, 
			string requestProperties, 
			out string responseProperties)
		{
			return _reqHandler.HandleRESTRequest(Capabilities, resourceName, operationName, operationInput, outputFormat, requestProperties, out responseProperties);
		}

		private byte[] RootSOE(NameValueCollection boundVariables, 
			string outputFormat,
			string requestProperties, 
			out string responseProperties)
		{
			responseProperties = null;
			JsonObject jObject = new JsonObject();
			return Encoding.UTF8.GetBytes(jObject.ToJson());
		}

		//metadataList/{metadataListID}
		//returns json with simplified layerinfo (name, id, extent)
		private byte[] GetMetadataList(NameValueCollection boundVariables, string outputFormat, string requestProperties, out string responseProperties)
		{
			responseProperties = null;

			//layerID
			int layerID = Convert.ToInt32(boundVariables["metadataListID"]);

			//execute
			var xml = GetMetadataXml(ref responseProperties, layerID);

			if (Regex.IsMatch(outputFormat, @"(?i)html?"))
			{
				// Transform to HTML using XSLT.
				responseProperties = "{\"Content-Type\" : \"text/html\"}";
				return TransformToHtml(xml);
			}
			else
			{
				return Encoding.UTF8.GetBytes(xml);
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
			string xml = GetMetadataXml(ref responseProperties, layerIdInt);

			if (Regex.IsMatch(outputFormat, @"(?i)html?"))
			{
				// Transform to HTML using XSLT.
				responseProperties = "{\"Content-Type\" : \"text/html\"}";
				return TransformToHtml(xml);
			}
			else // if (string.Compare(outputFormat, "xml", true) == 0)
			{
				responseProperties = "{\"Content-Type\" : \"text/xml\"}";
				return Encoding.UTF8.GetBytes(xml);
			}

		}

		private byte[] GetIdsOfLayersThatHaveMetadata(NameValueCollection boundVariables,
			string outputFormat,
			string requestProperties,
			out string responseProperties)
		{
			responseProperties = "{\"Content-Type\" : \"application/json\"}";
			var idArray = GetIdsOfLayersThatHaveMetadata();
			var serializer = new JavaScriptSerializer();
			var json = serializer.Serialize(idArray);
			return Encoding.UTF8.GetBytes(json);
		}

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

			return output.ToArray();


			////var msDataAccess = (IMapServerDataAccess)_serverObjectHelper.ServerObject;
			////IDataset layer = null;

			////string xml = null;
			////responseProperties = "{\"Content-Type\" : \"text/xml\"}";
			////try
			////{
			////    layer = msDataAccess.GetDataSource(defaultMapName, layerId) as IDataset;
			////}
		}

		private string GetMetadataXml(ref string responseProperties, int layerId)
		{
			var mapServer = (IMapServer3)_serverObjectHelper.ServerObject;
			string defaultMapName = mapServer.DefaultMapName;



			var msDataAccess = (IMapServerDataAccess)_serverObjectHelper.ServerObject;
			IDataset layer = null;

			string xml = null;
			responseProperties = "{\"Content-Type\" : \"text/xml\"}";
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
	}
}
