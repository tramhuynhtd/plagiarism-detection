using PlagiarismDetection.Models;
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
            sourceFile.Add("C:\\Users\\Admin\\Downloads\\Example\\main01.cpp");
            sourceFile.Add("C:\\Users\\Admin\\Downloads\\Example\\main02.cpp");
            sourceFile.Add("C:\\Users\\Admin\\Downloads\\Example\\main03.cpp");
            sourceFile.Add("C:\\Users\\Admin\\Downloads\\Example\\main04.cpp");
            sourceFile.Add("C:\\Users\\Admin\\Downloads\\Example\\main05.cpp");
            sourceFile.Add("C:\\Users\\Admin\\Downloads\\Example\\main10.cpp");
            return Json(new { Code = 200, SourceFile = sourceFile}, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CompareFile(string baseFile, string listSourceFile)
        {
            baseFile = "C:\\Users\\Admin\\Downloads\\Example\\main02.cpp";
            var result = new DetectModel().Compare(baseFile, listSourceFile);
            return View("Partial/_Result", result);
        }

        public ActionResult CompareDetail(string linkDetail)
        {
            ViewBag.Link = linkDetail;
            return View();
        }
    }
}