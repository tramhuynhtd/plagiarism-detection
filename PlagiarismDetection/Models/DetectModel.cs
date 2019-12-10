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
        public string SendFile(string baseFileInput, string sourceFileInput)
        {
            List<string> BaseFileList = baseFileInput.Split('\n').ToList().Where(ext => GetRestrictedFileTypes().Contains(Path.GetExtension(ext))).ToList();
            List<string> SourceFileList = sourceFileInput.Split('\n').ToList().Where(ext => GetRestrictedFileTypes().Contains(Path.GetExtension(ext))).ToList(); ;

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

            request.BaseFile.AddRange(BaseFileList);
            request.Files.AddRange(SourceFileList);

            if (request.SendRequest(out var response))
            {
                var result = response;
                return result;
            }
            else
            {
                return null;
            }
        }

        private List<string> GetRestrictedFileTypes()
        {
            var files = ".cpp";
            return files.Length > 0 ? files.Split(',').ToList() : new List<string>();
        }

        public ListResult Compare(string result)
        {
            return new ListResult {
                Compares = new CrawResult().StartCrawTable(result)
            };
        }

    }
}