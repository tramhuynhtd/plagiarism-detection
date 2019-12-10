using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PlagiarismDetection.Models.Schema
{
    public class ListResult
    {
        public List<Compare> Compares { get; set; }
    }
}