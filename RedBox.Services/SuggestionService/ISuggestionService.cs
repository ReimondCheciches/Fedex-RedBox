using System.Collections.Generic;
using RedBox.DataAccess;

namespace RedBox.Services.SuggestionService
{
    public interface ISuggestionService
    {
        List<Suggestion> GetSuggestions();
        List<Suggestion> GetArchivedSuggestions();
        void AddSuggestion(Suggestion suggestion);
        void RemoveSuggestion(int id);
    }
}
