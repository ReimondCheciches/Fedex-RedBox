using System.Collections.Generic;
using RedBox.DataAccess;
using RedBox.Services.Models;

namespace RedBox.Services.EventService
{
    public interface IEventService
    {
        List<Event> GetEvents();
        EventModel AddEvent(EventRequest eventDesc, string UserId);
        EventModel RespondToEvent(RespondToEventRequest respondToEventRequest);
        void ArchiveEvent(int eventId);
    }
}
