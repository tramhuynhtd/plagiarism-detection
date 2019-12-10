using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models.Schema
{
    public class SourceInfo
    {
        public string NameInfo { get; set; }

        public string Percent { get; set; }

        public string Source { get; set; }

        public List<Line> Lines { get; set; }

        public int NumberLine { get; set; }
    }
}