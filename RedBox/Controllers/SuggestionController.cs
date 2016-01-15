using System.Collections.Generic;
using System.Web.Http;
using RedBox.DataAccess;
using RedBox.Services.SuggestionService;
using System.Web.Security;
using Microsoft.AspNet.Identity;
using RedBox.Services.Models;

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
            var suggestions=new List<SuggestionModel>();
            _suggestionService.GetSuggestions().ForEach(p => suggestions.Add(new SuggestionModel() { 
                Description = p.Description, 
                Id = p.Id,
                UpVote = p.UpVotes, 
                DownVote = p.DownVotes, 
                Archived = p.Archived??true }));
            
            return suggestions;
        }

        [HttpGet]
        public IEnumerable<SuggestionModel> GetArchivedSuggestions()
        {
            var suggestions = new List<SuggestionModel>();
            _suggestionService.GetArchivedSuggestions().ForEach(p => suggestions.Add(new SuggestionModel()
            {
                Description = p.Description,
                Id = p.Id,
                UpVote = p.UpVotes,
                DownVote = p.DownVotes,
                Archived = p.Archived ?? true
            }));

            return suggestions;
        }

        [HttpPost]
        public void AddSuggestion(SuggestionRequest SuggestionReq)
        {
            _suggestionService.AddSuggestion(SuggestionReq.SuggestionDesc);
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

        public class SuggestionRequest
        {
            public string SuggestionDesc { get; set; }
        }
    }
}
