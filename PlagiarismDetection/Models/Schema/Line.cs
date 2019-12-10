using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models.Schema
{
    public class Line
    {
        public int startLine { get; set; }

        public int EndLine { get; set; }

        public string Color { get; set; }
    }
}