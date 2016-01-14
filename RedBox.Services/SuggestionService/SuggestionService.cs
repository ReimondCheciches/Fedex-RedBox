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
    }
}
