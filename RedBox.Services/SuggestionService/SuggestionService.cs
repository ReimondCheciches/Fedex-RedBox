using System.Collections.Generic;
using System.Linq;
using RedBox.DataAccess;
using RedBox.DataAccess.Repositories;

namespace RedBox.Services.SuggestionService
{
    public class SuggestionService : ISuggestionService
    {
        private readonly IRepository _repository;

        public SuggestionService(IRepository repository)
        {
            _repository = repository;
        }

        public List<Suggestion> GetSuggestions()
        {
            return _repository.GetEntities<Suggestion>().ToList();
        }

        public List<Suggestion> GetArchivedSuggestions()
        {
            return _repository.GetEntities<Suggestion>().Where(s => (bool) !s.Archived).ToList();
        }

        public void AddSuggestion(Suggestion suggestion)
        {
            _repository.Add(new Suggestion()
            {
                Description = suggestion.Description,
                Date = suggestion.Date
            });
            _repository.SaveChanges();
        }

        public void RemoveSuggestion(int id)
        {
            var suggestion = _repository.GetEntities<Suggestion>().FirstOrDefault(s => s.Id == id);

            _repository.Delete(suggestion);
            _repository.SaveChanges();
        }


        public void Vote(int suggestionId, bool upVote)
        {
            var userId = "87022DBA-F137-49FF-9C9B-E1F216D53545";
            
            var suggestion = _repository.GetEntities<Suggestion>().FirstOrDefault(p => p.Id == suggestionId);
            if (suggestion == null) return;
            
            if(upVote)
                suggestion.UpVotes++;
            else
                suggestion.DownVotes++;

            _repository.Update(suggestion);
            _repository.Add(new SuggestionVote()
            {
                UserId = userId,
                SuggestionId = suggestionId
            });

            _repository.SaveChanges();
        }

        public bool UserhasVoted(string userId)
        {
            var votes= _repository.GetEntities<SuggestionVote>().Where(p => p.UserId == userId).ToList();

            if (votes.Count > 0) 
                return true;

            return false;
        }
    }
}
