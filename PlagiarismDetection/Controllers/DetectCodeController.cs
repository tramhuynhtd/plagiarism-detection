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
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main01.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main02.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main03.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main04.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main05.cpp");
            sourceFile.Add("C:\\Users\\tram.huynh\\Downloads\\Example\\main10.cpp");
            return Json(new { Code = 200, SourceFile = sourceFile}, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CompareFile(string ListBaseFile, string ListSourceFile)
        {
            //DetectModel detectModel = new DetectModel();
            //var result = detectModel.Compare(ListBaseFile, ListSourceFile);
            //return Json(new { Code = 200, Result = result }, JsonRequestBehavior.AllowGet);
            var result = new DetectModel().Compare("http://moss.stanford.edu/results/533043163");
            return View("Partial/_Result", result);
        }

        public ActionResult CompareDetail(string LinkDetail)
        {
            ViewBag.Link = LinkDetail;
            return View();
        }
    }
}