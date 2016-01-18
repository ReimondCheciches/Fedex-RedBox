using System.Collections.Generic;
using System.Linq;
using RedBox.DataAccess;
using RedBox.DataAccess.Repositories;
using System;
using RedBox.Services.Models;

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

        public SuggestionModel AddSuggestion(string suggestionDesc)
        {
            var suggestion = new Suggestion()
            {
                Description = suggestionDesc,
                Date = DateTime.Now
            };

            _repository.Add(suggestion);
            _repository.SaveChanges();

            return new SuggestionModel
            {
                Date = suggestion.Date,
                Description = suggestion.Description,
                Id = suggestion.Id,
            };
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
            var votes = _repository.GetEntities<SuggestionVote>().Where(p => p.UserId == userId && p.SuggestionId == suggestionId).ToList();

            if (votes.Count > 0)
                return true;

            return false;
        }

        public void ArhiveSuggestion(int suggestionId)
        {
            var s = _repository.GetEntities<Suggestion>().FirstOrDefault(p => p.Id == suggestionId);

            if (s != null)
            {
                s.Archived = true;

                _repository.Update(s);
            }
            _repository.SaveChanges();
        }
    }
}
