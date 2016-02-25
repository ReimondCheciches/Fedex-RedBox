using System;

namespace RedBox.Services.Models
{
    public class EventRequest
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Time { get; set; }
        public DateTime? Date { get; set; }
    }
}