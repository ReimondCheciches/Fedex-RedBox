namespace RedBox.Services.Models
{
    public class SuggestionVoteModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int SuggestionId { get; set; }
        public bool UpVote { get; set; }
    }
}
