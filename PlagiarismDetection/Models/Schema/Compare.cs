using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models.Schema
{
    public class Compare
    {
        public Compare(SourceInfo source1, SourceInfo source2, string link)
        {
            Source1 = source1;
            Source2 = source2;
            Link = link;
        }

        public Compare()
        {

        }

        public SourceInfo Source1 { get; set; }

        public SourceInfo Source2 { get; set; }

        public string Link { get; set; }

    }
}