using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PlagiarismDetection.Controllers
{
    public class DetectCodeController : Controller
    {
        // GET: DetectCode
        public ActionResult Index()
        {
            

            return View();
        }

        public JsonResult ShowSourceFile()
        {
            List<string> sourceFile = new List<string>();
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\11.931.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\11.958.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\13.938.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\27.900.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main01.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main10.cpp");
            return Json(new { Code = 200, SourceFile = sourceFile}, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CompareFile(string ListBaseFile, string ListSourceFile)
        {
            List<string> sourceFile = new List<string>();
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\11.931.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\11.958.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\13.938.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\27.900.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main01.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main10.cpp");
            return Json(new { Code = 200, SourceFile = sourceFile }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ShowResult()
        {
            
            return View("Partial/_Result");
        }
    }
}