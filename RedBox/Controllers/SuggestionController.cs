using System.Collections.Generic;
using System.Web.Http;
using RedBox.DataAccess;
using RedBox.Services.SuggestionService;

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
        public List<Suggestion> GetSuggestions()
        {
            return _suggestionService.GetSuggestions();
        }

        [HttpGet]
        public List<Suggestion> GetArchivedSuggestions()
        {
            return _suggestionService.GetArchivedSuggestions();
        }

        [HttpGet]
        public void AddSuggestion(Suggestion suggestion)
        {
            _suggestionService.AddSuggestion(suggestion);
        }

        [HttpGet]
        public void RemoveSuggestion(int id)
        {
            _suggestionService.RemoveSuggestion(id);
        }
    }
}
