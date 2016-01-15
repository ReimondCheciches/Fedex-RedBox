using System.Collections.Generic;
using System.Linq;
using RedBox.DataAccess;
using RedBox.DataAccess.Repositories;
using System;

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

        public void AddSuggestion(string suggestionDesc)
        {

            _repository.Add(new Suggestion()
            {
                Description = suggestionDesc,
                Date = DateTime.Now
            });
            _repository.SaveChanges();
        }

        public void RemoveSuggestion(int id)
        {
            var suggestion = _repository.GetEntities<Suggestion>().FirstOrDefault(s => s.Id == id);

            _repository.Delete(suggestion);
            _repository.SaveChanges();
        }

        static object LockObject = new object();


        public void Vote(int suggestionId, bool upVote, string userId)
        {
            lock (LockObject)
            {
                var suggestion = _repository.GetEntities<Suggestion>().FirstOrDefault(p => p.Id == suggestionId);
                if (suggestion == null) return;

                if (upVote)
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
        
        }

        public bool UserHasVoted(string userId, int suggestionId)
        {
            var votes= _repository.GetEntities<SuggestionVote>().Where(p => p.UserId == userId && p.SuggestionId == suggestionId).ToList();

            if (votes.Count > 0) 
                return true;

            return false;
        }
    }
}
