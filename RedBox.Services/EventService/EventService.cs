using System;
using System.Collections.Generic;
using System.Linq;
using RedBox.DataAccess;
using RedBox.DataAccess.Repositories;
using RedBox.Services.Models;

namespace RedBox.Services.EventService
{
    public class EventService : IEventService
    {
        private readonly IRepository _repository;

        public EventService(IRepository repository)
        {
            _repository = repository;
        }

        public List<Event> GetEvents()
        {
            return _repository.GetEntities<Event>().ToList();
        }

        public void AddEvent(string eventDesc, string userId)
        {
            if (!string.IsNullOrEmpty(eventDesc))
            {
                var newEvent = new Event()
                {
                    Description = eventDesc,
                    Date = DateTime.Now,
                    UserId = userId
                };

                _repository.Add(newEvent);

                _repository.SaveChanges();
            }
        }

        public void RespondToEvent(RespondToEventRequest respondToEventRequest)
        {
            var userEvent =
                _repository.GetEntities<UserEvent>()
                    .FirstOrDefault(
                        p => p.EventId == respondToEventRequest.EventId && p.UserId.Equals(respondToEventRequest.UserId));

            if (userEvent != null)
            {
                userEvent.Response = respondToEventRequest.EventResponse;

                _repository.Update(userEvent);
            }
            else
            {
                var newUserEvent = new UserEvent()
                {
                    UserId = respondToEventRequest.UserId,
                    EventId = respondToEventRequest.EventId,
                    Response = respondToEventRequest.EventResponse
                };

                _repository.Add(newUserEvent);
            }

            _repository.SaveChanges();

        }
    }
}
