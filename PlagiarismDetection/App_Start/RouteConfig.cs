using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PlagiarismDetection
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "DetectCode", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DetectCode",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "DetectCode", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "ShowSourceFile",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "DetectCode", action = "ShowSourceFile", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "CompareFile",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "DetectCode", action = "CompareFile", id = UrlParameter.Optional }
            );

            //routes.MapRoute(
            //    name: "DetectCode",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "DetectCode", action = "Index", id = UrlParameter.Optional }
            //);
        }
    }
}
