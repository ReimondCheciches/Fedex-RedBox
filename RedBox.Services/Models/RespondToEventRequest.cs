namespace RedBox.Services.Models
{
    public class RespondToEventRequest
    {
        public int EventId { get; set; }
        public string EventResponse { get; set; }
        public string UserId { get; set; }
    }
}
