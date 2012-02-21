using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.EnterpriseServices;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Server;
using ESRI.ArcGIS.SOESupport;
using System.Xml.Xsl;
using System.Xml;
using LayerMetadataSoe.Properties;
using System.IO;

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

			RestOperation getLayerMetadataOp = new RestOperation("getLayerMetadata",
				new string[] { "layer" },
				new string[] { "xml", "html" },
				GetMetadataForLayer
				);

			soeResource.operations.Add(getLayerMetadataOp);
			
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
			var mapServer = (IMapServer3)_serverObjectHelper.ServerObject;
			string defaultMapName = mapServer.DefaultMapName;



			var msDataAccess = (IMapServerDataAccess)_serverObjectHelper.ServerObject;
			IDataset layer = null;

			string xml = null;
			responseProperties = "{\"Content-Type\" : \"text/xml\"}";
			try
			{
				layer = msDataAccess.GetDataSource(defaultMapName, layerIdInt) as IDataset;
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
			}
			catch (NotImplementedException ex)
			{
				xml = string.Format("<error>{0}</error>", ex.Message);
			}

			if (Regex.IsMatch(outputFormat, @"(?i)html?"))
			{
				// Transform to HTML using XSLT.
				responseProperties = "{\"Content-Type\" : \"text/html\"}";
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
			else // if (string.Compare(outputFormat, "xml", true) == 0)
			{
				responseProperties = "{\"Content-Type\" : \"text/xml\"}";
				return Encoding.UTF8.GetBytes(xml);
			}

		}
	}
}
