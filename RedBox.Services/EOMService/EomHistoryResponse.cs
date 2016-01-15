using System;
using System.Collections.Generic;

namespace RedBox.Services.EOMService
{
    public class EomHistoryResponse
    {
        public string Winner { get; set; }
        public DateTime Date { get; set; }
        public IEnumerable<VoteGroup> AllVotes { get; set; }
    }
}