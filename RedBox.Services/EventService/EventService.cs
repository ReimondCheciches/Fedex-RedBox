using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
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

        public EventModel AddEvent(EventRequest eventRequest, string userId)
        {
            if (string.IsNullOrEmpty(eventRequest.Description)) return null;

            var newEvent = new Event()
            {
                Description = eventRequest.Description,
                Time = eventRequest.Time,
                Location = eventRequest.Location,
                Date = DateTime.Now,
                EventDate = eventRequest.Date,
                UserId = userId,
            };

            _repository.Add(newEvent);

            _repository.SaveChanges();

            var userFullName =
                _repository.GetEntities<AspNetUser>()
                    .Where(u => u.Id == userId)
                    .Select(u => u.UserInfo.FullName)
                    .FirstOrDefault();
            if (userFullName == null) return null;

            return new EventModel()
            {
                Id = newEvent.Id,
                Date = newEvent.Date,
                Description = newEvent.Description,
                UserName = userFullName,
                FullName = userFullName,
                Time = newEvent.Time,
                EventDate = newEvent.EventDate,
                Location = newEvent.Location,
                NotNowUsers = new List<UserModel>(),
                GoingUsers = new List<UserModel>(),
                TentativeUsers = new List<UserModel>()
            };
        }

        public EventModel RespondToEvent(RespondToEventRequest respondToEventRequest)
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

             userEvent =
               _repository.GetEntities<UserEvent>()
                   .FirstOrDefault(
                       p => p.EventId == respondToEventRequest.EventId && p.UserId.Equals(respondToEventRequest.UserId));

            var eventItem =
                _repository.GetEntities<Event>()
                    .Where(e => e.Id == userEvent.EventId)
                    .Include(e => e.AspNetUser.UserInfo)
                    .FirstOrDefault();

            if (eventItem == null)
                return null;

            return new EventModel()
            {
                Going = userEvent != null && userEvent.Response.Equals(EventResponse.Going.ToString()),
                Tentative = userEvent != null && userEvent.Response.Equals(EventResponse.Tentative.ToString()),
                NotNow = userEvent != null && userEvent.Response.Equals(EventResponse.NotNow.ToString()),
                GoingUsers =
                    eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.Going.ToString()))
                        .Select(u => new UserModel() {FullName = u.AspNetUser.UserInfo.FullName})
                        .ToList(),
                TentativeUsers =
                    eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.Tentative.ToString()))
                        .Select(u => new UserModel() {FullName = u.AspNetUser.UserInfo.FullName})
                        .ToList(),
                NotNowUsers =
                    eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.NotNow.ToString()))
                        .Select(u => new UserModel() {FullName = u.AspNetUser.UserInfo.FullName})
                        .ToList()
            };

        }

        public void ArchiveEvent(int eventId)
        {
            var e = _repository.GetEntities<Event>().FirstOrDefault(p => p.Id == eventId);

            if (e != null)
            {
                e.Archived = true;

                _repository.Update(e);
            }
            _repository.SaveChanges();
        }

        public void CancelEvent(EventRequest eventRequest, string userId)
        {
            var eventObject = _repository.GetEntities<Event>() .FirstOrDefault(
              p => p.Id == eventRequest.Id && p.UserId.Equals(userId));

            if (eventObject == null) return;

            eventObject.IsCanceld = true;

            _repository.SaveChanges();
        }
    }
}
