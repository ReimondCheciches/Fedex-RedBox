using System;
using System.Collections.Generic;
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

        public EomResponse GetCurrentEOM()
        {
            var currentDate = DateTime.Now;
            var currentEOM =
                _repository.GetEntities<EOM>()
                    .FirstOrDefault(p => p.Date.Year == currentDate.Year && p.Date.Month == currentDate.Month);
            if (currentEOM != null)
                return new EomResponse()
                {
                    Date = currentEOM.Date
                };

            _repository.Add(new EOM()
            {
                Date = currentDate
            });
            _repository.SaveChanges();

            return _repository.GetEntities<EOM>()
                    .Where(p => p.Date.Year == currentDate.Year && p.Date.Month == currentDate.Month).Select(s => new EomResponse()
                    {
                        Date = s.Date
                    }).FirstOrDefault();
        }

        public List<EomHistoryResponse> GetAllEOMs()
        {
            return _repository.GetEntities<EOM>().Where(p => !string.IsNullOrEmpty(p.WinnerId)).ToList().Select(e => new EomHistoryResponse()
            {
                Winner = e.AspNetUser.UserInfo.FullName,
                Date = e.Date,
                AllVotes = e.EOMVotes.GroupBy(u => u.AspNetUser).Select(g => new VoteGroup
                {
                    Votes = g.Count(),
                    UserFullName = g.Key.UserInfo.FullName,
                    Reasons = g.Select(r => r.Reason)
                })
            }).ToList();
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

        public void EndVote()
        {
            var current = _repository.GetEntities<EOM>().FirstOrDefault(v => v.WinnerId == null);

            if (current == null) return;

            var userId = _repository.GetEntities<EOMVote>().Where(p => p.EOMid == current.Id).ToList().GroupBy(p => p.NominatedUserId).Max();
            var eom = _repository.GetEntities<EOM>().FirstOrDefault(p => p.Id == current.Id);
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

        public void AddVote(EomVoteRequest request, string UserId)
        {
            var currentEom = _repository.GetEntities<EOM>().OrderByDescending(v => v.Id).FirstOrDefault();

            if (currentEom == null)
            {
                currentEom = new EOM()
                {
                    Date = DateTime.Now,
                };

                _repository.Add(currentEom);

                _repository.SaveChanges();
            };

            var hasVoted =
                _repository.GetEntities<EOMUserVote>().Any(v => v.UserId == UserId && v.EOMid == currentEom.Id);

            if (hasVoted) return;


            var vote = new EOMVote()
            {
                NominatedUserId = request.UserId,
                Reason = request.Reason,
                EOMid = currentEom.Id
            };

            var userVote = new EOMUserVote()
            {
                UserId = UserId,
                EOMid = currentEom.Id
            };

            _repository.Add(userVote);

            _repository.Add(vote);

            _repository.SaveChanges();
        }

        public bool HasVoted(string userId)
        {

            var currentEom = _repository.GetEntities<EOM>().OrderByDescending(v => v.Id).FirstOrDefault();

            if (currentEom == null)
                return false;

            return  _repository.GetEntities<EOMUserVote>().Any(v => v.UserId == userId && v.EOMid == currentEom.Id);
        }
    }

    public class EomResponse
    {
        public DateTime Date { get; set; }
    }

    public class VoteGroup
    {
        public int Votes { get; set; }
        public string UserFullName { get; set; }
        public IEnumerable<string> Reasons { get; set; }
    }
}
