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
                //var tds = tr.Descendants("td").Where(node => node.FirstChild.NameInfo.Equals("a")).ToList();
                var tds = tr.Descendants("td").ToList();
                var result = new Compare
                {
                    Source1 = new SourceInfo{
                        NameInfo = tds[0].Descendants("a").FirstOrDefault().InnerText }
                    ,
                    Source2 = new SourceInfo{
                        NameInfo = tds[1].Descendants("a").FirstOrDefault().InnerText }
                    ,
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
            var subUrl = url.Substring(0, url.LastIndexOf('/') + 1);
            var frameLinks = htmlDocument.DocumentNode.Descendants("frame").ToList().Select(node => subUrl + node.ChildAttributes("src").FirstOrDefault().Value).Skip(1).ToList();
            var details = new List<Compare>();
            foreach (var link in frameLinks)
            {
                html = httpClient.GetStringAsync(link).Result;
                htmlDocument.LoadHtml(html);

                var text = htmlDocument.DocumentNode.Descendants("body").FirstOrDefault().InnerText;
                //var detail = new Compare
                //{
                //    NameInfo = text.Descendants("body").FirstOrDefault().InnerText

                //};
                //details.Add(detail);
            }

            Console.Write("a");

        }
    }
}