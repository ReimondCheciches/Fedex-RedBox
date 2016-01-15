using System.Collections.Generic;
using System.Web.Http;
using RedBox.DataAccess;
using RedBox.Services.SuggestionService;
using System.Web.Security;

namespace RedBox.Web.Controllers
{
    public class SuggestionController : ApiController
    {
        private readonly ISuggestionService _suggestionService;

        public SuggestionController()
        {

        }
        public SuggestionController(ISuggestionService suggestionService)
        {
            _suggestionService = suggestionService;
        }

        [HttpGet]
        public List<Suggestion> GetSuggestions()
        {
            return _suggestionService.GetSuggestions();
        }

        [HttpGet]
        public List<Suggestion> GetArchivedSuggestions()
        {
            return _suggestionService.GetArchivedSuggestions();
        }

        [HttpPost]
        public void AddSuggestion(SuggestionRequest SuggestionDesc)
        {
            _suggestionService.AddSuggestion(SuggestionDesc.SuggestionDesc);
        }

        [HttpPost]
        public void RemoveSuggestion(int id)
        {
            _suggestionService.RemoveSuggestion(id);
        }

        [HttpPost]
        public void Vote(int suggestionId, bool upVote)
        {
            MembershipUser user = Membership.GetUser();
            if (!_suggestionService.UserhasVoted(user.ProviderUserKey.ToString())) return;
            _suggestionService.Vote(suggestionId, upVote, user.ProviderUserKey.ToString());
        }

        public class SuggestionRequest {
            public string SuggestionDesc { get; set; }
        }
    }
}
