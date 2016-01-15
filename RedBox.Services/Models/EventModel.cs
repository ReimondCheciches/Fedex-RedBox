using System;

namespace RedBox.Services.Models
{
    public class EventModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public bool Archived { get; set; }
    }
}
