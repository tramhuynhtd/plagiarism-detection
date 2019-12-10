using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models.Schema
{
    public class Compare
    {
        public SourceInfo Source1 { get; set; }

        public SourceInfo Source2 { get; set; }

        public string Link { get; set; }

    }
}