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

        public Compare StartCrawDetail(string url)
        {
            if (String.IsNullOrEmpty(url))
            {
                return new Compare();
            }
            var httpClient = new HttpClient();
            var html = httpClient.GetStringAsync(url).Result;
            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(html);
            var subUrl = url.Substring(0, url.LastIndexOf('/') + 1) + "match0-top.html";
            html = httpClient.GetStringAsync(subUrl).Result;
            htmlDocument.LoadHtml(html);
            var trs = htmlDocument.DocumentNode.Descendants("tr").ToList();
            var ths = trs.Where(node => node.FirstChild.Name.Equals("th")).FirstOrDefault().Descendants("th").ToList();
            var result = new Compare
            {
                Source1 = InformationOfResult(ths[0].InnerText),
                Source2 = InformationOfResult(ths[2].InnerText),
            };
            trs = trs.Where(node => node.FirstChild.Name.Equals("td")).ToList();
            foreach (var tr in trs)
            {
                var tds = tr.Descendants("td").ToList().Where((c, index) => index % 2 == 0).ToList();
                result.Source1.Lines.Add(GetLine(tds[0].Descendants("a").FirstOrDefault().InnerText));
                result.Source2.Lines.Add(GetLine(tds[1].Descendants("a").FirstOrDefault().InnerText));
            }
            Console.Write("a");
            return result;
        }

        private SourceInfo InformationOfResult(string file)
        {
            return new SourceInfo
            {
                NameInfo = GetName(file),
                Percent = GetPercent(file),
                Lines = new List<Line>(),
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

        private Line GetLine(string line)
        {
            var start = Convert.ToInt32(line.Substring(0, line.IndexOf("-")));
            var end = Convert.ToInt32(line.Substring(line.IndexOf("-") + 1, line.Length - line.IndexOf("-")-1));
            return new Line(start, end);
        }
    }
}