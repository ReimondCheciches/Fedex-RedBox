using System;
using System.Linq;
using RedBox.DataAccess;
using RedBox.DataAccess.Repositories;

namespace RedBox.Services.EOMService
{
    public class EOMService : IEOMService
    {
        private readonly IRepository _repository;

        public EOMService(IRepository repository)
        {
            _repository = repository;
        }

        public EOM GetCurrentEOM()
        {
            var currentDate = DateTime.Now;
            var currentEOM =
                _repository.GetEntities<EOM>()
                    .FirstOrDefault(p => p.Date.Year == currentDate.Year && p.Date.Month == currentDate.Month);
            if (currentEOM != null)
                return currentEOM;

            _repository.Add(new EOM()
            {
                Date = currentDate
            });
            _repository.SaveChanges();

            return _repository.GetEntities<EOM>()
                    .FirstOrDefault(p => p.Date.Year == currentDate.Year && p.Date.Month == currentDate.Month);
        }

        public System.Collections.Generic.List<EOM> GetAllEOMs()
        {
            return _repository.GetEntities<EOM>().Where(p => !string.IsNullOrEmpty(p.WinnerId)).ToList();
        }

        public void AddVote(EOMVote vote, EOMUserVote userVote)
        {
            _repository.Add(vote);
            _repository.Add(userVote);

            _repository.SaveChanges();
        }

        public void RemoveUserVote(int eomId, string userId)
        {
            var userVote =
                _repository.GetEntities<EOMUserVote>().FirstOrDefault(p => p.EOMid == eomId && p.UserId == userId);
            if (userVote != null)
            {
                _repository.Delete(_repository.GetEntities<EOMUserVote>().FirstOrDefault(p => p.EOMid == eomId && p.UserId == userId));
                _repository.SaveChanges();
            }
        }

        public void EndVote(int eomId)
        {
            var userId = _repository.GetEntities<EOMVote>().Where(p => p.EOMid == eomId).GroupBy(p => p.NominatedUserId).Max();
            var eom = _repository.GetEntities<EOM>().FirstOrDefault(p => p.Id == eomId);
            if (eom != null)
            {
                eom.WinnerId = userId.Key;
                _repository.Update(eom);
                _repository.SaveChanges();
            }

        }

        public int GetNumberOfCurrentEOMVotes()
        {
            var currentDate = DateTime.Now;
            var currentEOM =
                _repository.GetEntities<EOM>()
                    .FirstOrDefault(p => p.Date.Year == currentDate.Year && p.Date.Month == currentDate.Month);

            return currentEOM != null ? currentEOM.EOMVotes.Count : 0;
        }
    }
}
