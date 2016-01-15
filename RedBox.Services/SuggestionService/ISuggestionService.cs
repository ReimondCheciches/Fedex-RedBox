﻿using System.Collections.Generic;
using RedBox.DataAccess;

namespace RedBox.Services.SuggestionService
{
    public interface ISuggestionService
    {
        List<Suggestion> GetSuggestions();
        void AddSuggestion(string suggestionDesc);
        void RemoveSuggestion(int id);
        void Vote(int suggestionId, bool upVote, string userId);
        bool UserHasVoted(string userId, int suggestionId);
    }
}
 
