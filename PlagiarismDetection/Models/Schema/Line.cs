using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models.Schema
{
    public class Line
    {
        public Line(int startLine, int endLine)
        {
            StartLine = startLine;
            EndLine = endLine;
        }

        public int StartLine { get; set; }

        public int EndLine { get; set; }
    }
}