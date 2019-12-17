using PlagiarismDetection.Models.Schema;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models
{
    public class DetectModel
    {
        public List<Compare> Compare(string baseFileInput, string sourceFileInput)
        {
            List<string> SourceFileList = sourceFileInput.Split('\n').ToList().Where(ext => GetRestrictedFileTypes().Contains(Path.GetExtension(ext))).ToList();
            var request = new MossRequest
            {
                UserId = 1,
                IsDirectoryMode = false,
                IsBetaRequest = false,
                Comments = "",
                Language = "cc",
                NumberOfResultsToShow = 250,
                MaxMatches = 10
            };

            request.Files.AddRange(SourceFileList);
            if (SourceFileList.Count <= 0)
                return new List<Compare>();

            if (request.SendRequest(out var response))
            {
                return ShowResult(response, baseFileInput);
            }
            else
            {
                return new List<Compare>();
            }
        }

        private List<string> GetRestrictedFileTypes()
        {
            var files = ".cpp";
            return files.Length > 0 ? files.Split(',').ToList() : new List<string>();
        }

        public List<Compare> ShowResult(string result, string baseFile)
        {
            var resultAllFile = new CrawResult().StartCrawTable(result);

            return resultAllFile.Select(p => p).Where(p => baseFile.Contains(p.Source1.NameInfo) || baseFile.Contains(p.Source2.NameInfo)).ToList();
            //return new CrawResult().StartCrawTable(result);
        }

    }
}