using System;
using System.Collections.Generic;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Server;

namespace Wsdot.ArcObjects.Extensions
{
	public static class ArcObjectsLinqExtensions
	{
		public static IEnumerable<long> AsEnumerable(this ILongArray longArray)
		{
			for (int i = 0; i < longArray.Count; i++)
			{
				yield return longArray.get_Element(i);
			}
		}

		public static IEnumerable<IFeature> AsEnumerable(this IFeatureCursor source)
		{
			Func<IFeature> next = () => source.NextFeature();
			IFeature current = next();
			while (current != null)
			{
				yield return current;
				current = next();
			}
		}

		public static IEnumerable<IMapLayerInfo3> AsEnumerable(this IMapLayerInfos layerInfos)
		{
			for (int i = 0; i < layerInfos.Count; i++)
			{
				yield return layerInfos.get_Element(i) as IMapLayerInfo3;
			}
		}

		public static IEnumerable<IServerObjectExtensionType> AsEnumerable(this IEnumServerObjectExtensionType source)
		{
			Func<IServerObjectExtensionType> next = () => source.Next();
			IServerObjectExtensionType current = next();
			while (current != null)
			{
				yield return current;
				current = next();
			}
		}

		public static IEnumerable<IServerObjectConfiguration4> AsEnumerable(this IEnumServerObjectConfiguration source)
		{
			Func<IServerObjectConfiguration4> next = () => source.Next() as IServerObjectConfiguration4;
			var current = next();
			while (current != null)
			{
				yield return current;
				current = next();
			}
		}
	}
}