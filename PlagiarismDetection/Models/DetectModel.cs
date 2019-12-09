using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models
{
    public class DetectModel
    {
        public string Compare(string baseFileInput, string sourceFileInput)
        {
            List<string> BaseFileList = baseFileInput.Split('\n').ToList();
            List<string> SourceFileList = sourceFileInput.Split('\n').ToList();

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
    }
}