using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using RedBox.Services.EventService;
using RedBox.Services.Models;
using System;
using System.Globalization;

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
                    GoingUsers = p.UserEvents.Where(x => x.Response.Equals(EventResponse.Going.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList(),
                    TentativeUsers = p.UserEvents.Where(x => x.Response.Equals(EventResponse.Tentative.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList(),
                    NotNowUsers = p.UserEvents.Where(x => x.Response.Equals(EventResponse.NotNow.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList()
                });
            });

            return events;
        }

        [HttpGet]
        public IEnumerable<EventModel> GetEventsForCurrentWeek()
        {
            var userId = User.Identity.GetUserId();

            var events = new List<EventModel>();
            DateTime StartDay = GetFirstDayOfWeekForDay(DateTime.Today);
            DateTime EndDay = StartDay.AddDays(7);
            var allEvents = _eventService.GetEvents();
            foreach (var eventItem in allEvents)
            {
                var firstOrDefault = eventItem.UserEvents.FirstOrDefault(u => u.UserId.Equals(userId));
                if (eventItem.Date.Date.CompareTo(StartDay.Date) >= 0 && eventItem.Date.Date.CompareTo(EndDay.Date) <= 0)
                {
                    events.Add(new EventModel()
                    {
                        Id = eventItem.Id,
                        Description = eventItem.Description,
                        Date = eventItem.Date,
                        Archived = eventItem.Archived,
                        UserName = eventItem.AspNetUser.UserInfo.FullName,
                        Going = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.Going.ToString()),
                        Tentative = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.Tentative.ToString()),
                        NotNow = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.NotNow.ToString()),
                        GoingUsers = eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.Going.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList(),
                        TentativeUsers = eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.Tentative.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList(),
                        NotNowUsers = eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.NotNow.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList()
                    });
                }
            }
            return events;
        }


        [HttpGet]
        public IEnumerable<EventModel> GetEventsForCurrentMonth()
        {
            var userId = User.Identity.GetUserId();

            var events = new List<EventModel>();
            DateTime StartDay = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            DateTime EndDay = StartDay.AddMonths(1).AddDays(-1);
            var allEvents = _eventService.GetEvents();

            foreach (var eventItem in allEvents)
            {
                var firstOrDefault = eventItem.UserEvents.FirstOrDefault(u => u.UserId.Equals(userId));
                if ((eventItem.Date.Date.CompareTo(StartDay.Date) >= 0 && eventItem.Date.Date.CompareTo(EndDay.Date) <= 0))
                {
                    events.Add(new EventModel()
                    {
                        Id = eventItem.Id,
                        Description = eventItem.Description,
                        Date = eventItem.Date,
                        Archived = eventItem.Archived,
                        UserName = eventItem.AspNetUser.UserInfo.FullName,
                        Going = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.Going.ToString()),
                        Tentative = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.Tentative.ToString()),
                        NotNow = firstOrDefault != null && firstOrDefault.Response.Equals(EventResponse.NotNow.ToString()),
                        GoingUsers = eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.Going.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList(),
                        TentativeUsers = eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.Tentative.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList(),
                        NotNowUsers = eventItem.UserEvents.Where(x => x.Response.Equals(EventResponse.NotNow.ToString())).Select(u => new UserModel() { FullName = u.AspNetUser.UserInfo.FullName }).ToList()
                    });
                }
            }
            return events;
        }

        [HttpPost]
        public EventModel AddEvent(EventRequest EventRequest)
        {
            var userId = User.Identity.GetUserId();

            return _eventService.AddEvent(EventRequest.EventDesc, userId);
        }

        [HttpPost]
        public EventModel RespondToEvent(RespondToEventRequest respondToEventRequest)
        {
            respondToEventRequest.UserId = User.Identity.GetUserId();
            return _eventService.RespondToEvent(respondToEventRequest);
        }

        [HttpPost]
        public void ArchiveEvent(EventRequest EventRequest)
        {
            _eventService.ArchiveEvent(EventRequest.Id);
        }

        public class EventRequest
        {
            public int Id { get; set; }
            public string EventDesc { get; set; }
        }

        private DateTime GetFirstDayOfWeekForDay(DateTime dayInWeek)
        {
            CultureInfo defaultCultureInfo = CultureInfo.CurrentCulture;
            return GetFirstDayOfWeek(dayInWeek, defaultCultureInfo);
        }

        private DateTime GetFirstDayOfWeek(DateTime dayInWeek, CultureInfo cultureInfo)
        {
            DayOfWeek firstDay = cultureInfo.DateTimeFormat.FirstDayOfWeek;
            DateTime firstDayInWeek = dayInWeek.Date;
            while (firstDayInWeek.DayOfWeek != firstDay)
                firstDayInWeek = firstDayInWeek.AddDays(-1);

            return firstDayInWeek;
        }
    }
}
