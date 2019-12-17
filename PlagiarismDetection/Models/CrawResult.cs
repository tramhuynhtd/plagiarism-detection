using HtmlAgilityPack;
using PlagiarismDetection.Models.Schema;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace PlagiarismDetection.Models
{
    public class CrawResult
    {
        public List<Compare> StartCrawTable(string url)
        {
            var httpClient = new HttpClient();
            var html = httpClient.GetStringAsync(url).Result;
            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(html);

            var trs = htmlDocument.DocumentNode.Descendants("tr").Where(node => node.FirstChild.Name.Equals("td")).ToList();

            var results = new List<Compare>();

            foreach (var tr in trs)
            {
                var tds = tr.Descendants("td").ToList();
                var result = new Compare
                {
                    Source1 = InformationOfResult(tds[0].Descendants("a").FirstOrDefault().InnerText),
                    Source2 = InformationOfResult(tds[1].Descendants("a").FirstOrDefault().InnerText),
                    Link = tds[1].Descendants("a").FirstOrDefault().ChildAttributes("href").FirstOrDefault().Value,
                };

                results.Add(result);
            }
            return results;
        }

        public void StartCrawDetail(string url)
        {
            var httpClient = new HttpClient();
            var html = httpClient.GetStringAsync(url).Result;
            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(html);
            var subUrl = url.Substring(0, url.LastIndexOf('/') + 1) + "match0-top.html";
            html = httpClient.GetStringAsync(subUrl).Result;
            htmlDocument.LoadHtml(html);
            var trs = htmlDocument.DocumentNode.Descendants("tr").ToList();
            var ths = trs.Where(node => node.FirstChild.Name.Equals("th")).ToList();
            var result = new Compare
            {
                Source1 = InformationOfResult(ths[0].InnerText),
                Source2 = InformationOfResult(ths[3].InnerText),
            };
            Console.Write("a");

        }

        private SourceInfo InformationOfResult(string file)
        {
            return new SourceInfo
            {
                NameInfo = GetName(file),
                Percent = GetPercent(file)
            };
        }

        private string GetName(string file)
        {
            return file.Substring(0, file.IndexOf(" ("));
        }

        private string GetPercent(string file)
        {
            return file.Substring(file.IndexOf(" (") + 2, file.IndexOf(")") - file.IndexOf(" (") - 2);
        }
    }
}