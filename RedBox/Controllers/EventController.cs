using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using RedBox.Services.EventService;
using RedBox.Services.Models;

namespace RedBox.Web.Controllers
{
    public class EventController : ApiController
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public IEnumerable<EventModel> GetEvents()
        {
            var userId = User.Identity.GetUserId();

            var events = new List<EventModel>();
            _eventService.GetEvents().ForEach(p =>
            {
                var firstOrDefault = p.UserEvents.FirstOrDefault(u => u.UserId.Equals(userId));
                events.Add(new EventModel()
                                                       {
                                                           Id = p.Id,
                                                           Description = p.Description,
                                                           Date = p.Date,
                                                           Archived = p.Archived,
                                                           UserName = p.AspNetUser.UserInfo.FullName,
                                                           Going = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.Going.ToString()),
                                                           Tentative = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.Tentative.ToString()),
                                                           NotNow = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.NotNow.ToString()),
                                                           GoingUsers = p.UserEvents.Where(x => x.Response.Equals(EventResponse.Going.ToString())).Select(u => new UserModel(){ FullName = u.AspNetUser.UserInfo.FullName}).ToList(),
                                                           TentativeUsers = p.UserEvents.Where(x => x.Response.Equals(EventResponse.Tentative.ToString())).Select(u=> new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList(),
                                                           NotNowUsers = p.UserEvents.Where(x => x.Response.Equals(EventResponse.NotNow.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList()
                                                       });
            });

            return events;
        }

        [HttpPost]
        public void AddEvent(EventRequest EventRequest)
        {
            var userId = User.Identity.GetUserId();

            _eventService.AddEvent(EventRequest.EventDesc, userId);
        }

        [HttpPost]
        public void RespondToEvent(RespondToEventRequest respondToEventRequest)
        {
            respondToEventRequest.UserId = User.Identity.GetUserId();
            _eventService.RespondToEvent(respondToEventRequest);
        }

        public class EventRequest
        {
            public string EventDesc { get; set; }
        }
    }
}
