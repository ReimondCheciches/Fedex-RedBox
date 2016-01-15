using System;

namespace RedBox.Services.Models
{
    public class EventModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public bool Archived { get; set; }
        public string UserName { get; set; }
        public bool Going { get; set; }
        public bool Tentative { get; set; }
        public bool NotNow { get; set; }
    }
}
