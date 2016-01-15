using System.Collections.Generic;
using RedBox.DataAccess;
using RedBox.Services.Models;

namespace RedBox.Services.EventService
{
    public interface IEventService
    {
        List<Event> GetEvents();
        void AddEvent(string eventDesc, string UserId);
        void RespondToEvent(RespondToEventRequest respondToEventRequest);
        void ArchiveEvent(int eventId);
    }
}
