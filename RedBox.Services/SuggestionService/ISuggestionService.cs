using System.Collections.Generic;
using RedBox.DataAccess;
using RedBox.Services.Models;

namespace RedBox.Services.SuggestionService
{
    public interface ISuggestionService
    {
        List<Suggestion> GetSuggestions();
        SuggestionModel AddSuggestion(string suggestionDesc);
        void RemoveSuggestion(int id);
        void Vote(int suggestionId, bool upVote, string userId);
        bool UserHasVoted(string userId, int suggestionId);
        void ArhiveSuggestion(int suggestionId);
    }
}
 
