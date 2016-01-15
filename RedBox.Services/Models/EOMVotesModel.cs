namespace RedBox.Services.Models
{
    public class EOMVotesModel
    {
        public int Id { get; set; }
        public string NominatedUserId { get; set; }
        public string Reason { get; set; }
        public int EOMId { get; set; }
    }
}
