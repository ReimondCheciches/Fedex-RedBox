using System;

namespace RedBox.Services.Models
{
    public class SuggestionModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int UpVote { get; set; }
        public int DownVote { get; set; }
        public bool Archived { get; set; }
    }
}
