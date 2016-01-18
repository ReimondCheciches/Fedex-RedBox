using System.Collections.Generic;
using System.Web.Http;
using RedBox.DataAccess;
using RedBox.Services.SuggestionService;
using System.Web.Security;
using Microsoft.AspNet.Identity;
using RedBox.Services.Models;
using System;
using System.Globalization;
using System.Linq;

namespace RedBox.Web.Controllers
{
    public class SuggestionController : ApiController
    {
        private readonly ISuggestionService _suggestionService;

        public SuggestionController(ISuggestionService suggestionService)
        {
            _suggestionService = suggestionService;
        }

        [HttpGet]
        public IEnumerable<SuggestionModel> GetSuggestions()
        {
            var userId = User.Identity.GetUserId();

            var suggestions = new List<SuggestionModel>();
            _suggestionService.GetSuggestions().ForEach(p => suggestions.Add(new SuggestionModel()
            {
                Id = p.Id,
                Description = p.Description,
                Date = p.Date,
                UpVote = p.UpVotes,
                DownVote = p.DownVotes,
                Archived = (p.Archived != null && p.Archived == true),
                HasVoted = p.SuggestionVotes.Any(v => v.UserId == userId)
            }));

            return suggestions;
        }

        [HttpGet]
        public IEnumerable<SuggestionModel> GetSuggestionsCurrentWeek()
        {
            var userId = User.Identity.GetUserId();
            var suggestions = new List<SuggestionModel>();
            DateTime StartDay = GetFirstDayOfWeekForDay(DateTime.Today);
            DateTime EndDay = StartDay.AddDays(7);
            var allSuggestions = _suggestionService.GetSuggestions();
            foreach (var suggestion in allSuggestions)
            {
                if (suggestion.Date.Date.CompareTo(StartDay.Date) >= 0 && suggestion.Date.Date.CompareTo(EndDay.Date) <= 0)
                {
                    suggestions.Add(new SuggestionModel()
                    {
                        Id = suggestion.Id,
                        Description = suggestion.Description,
                        Date = suggestion.Date,
                        UpVote = suggestion.UpVotes,
                        DownVote = suggestion.DownVotes,
                        Archived = (suggestion.Archived != null && suggestion.Archived == true) ? true : false,
                         HasVoted = suggestion.SuggestionVotes.Any(v => v.UserId == userId)
                    });
                }
            }
            return suggestions;
        }


        [HttpGet]
        public IEnumerable<SuggestionModel> GetSuggestionsCurrentMonth()
        {
            var userId = User.Identity.GetUserId();
            var suggestions = new List<SuggestionModel>();
            DateTime StartDay = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            DateTime EndDay = StartDay.AddMonths(1).AddDays(-1);
            var allSuggestions = _suggestionService.GetSuggestions();
            foreach (var suggestion in allSuggestions)
            {
                if ((suggestion.Date.Date.CompareTo(StartDay.Date) >= 0 && suggestion.Date.Date.CompareTo(EndDay.Date) <= 0))
                {
                    suggestions.Add(new SuggestionModel()
                    {
                        Id = suggestion.Id,
                        Description = suggestion.Description,
                        Date = suggestion.Date,
                        UpVote = suggestion.UpVotes,
                        DownVote = suggestion.DownVotes,
                        Archived = (suggestion.Archived != null && suggestion.Archived == true) ? true : false,
                         HasVoted = suggestion.SuggestionVotes.Any(v => v.UserId == userId)
                    });
                }
            }
            return suggestions;
        }



        [HttpPost]
        public SuggestionModel AddSuggestion(SuggestionRequest SuggestionReq)
        {
            return _suggestionService.AddSuggestion(SuggestionReq.SuggestionDesc);
        }

        [HttpPost]
        public void RemoveSuggestion(int id)
        {
            _suggestionService.RemoveSuggestion(id);
        }

        [HttpPost]
        public void Vote(SuggestionVoteModel vote)
        {
            var userId = User.Identity.GetUserId();
            if (_suggestionService.UserHasVoted(userId, vote.SuggestionId)) return;
            _suggestionService.Vote(vote.SuggestionId, vote.UpVote, userId);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public void ArchiveSuggestion(SuggestionRequest SuggestionRequest)
        {
            _suggestionService.ArhiveSuggestion(SuggestionRequest.Id);
        }

        public class SuggestionRequest
        {
            public int Id { get; set; }
            public string SuggestionDesc { get; set; }
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
