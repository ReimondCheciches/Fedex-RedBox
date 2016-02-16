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
            var currentDate = _repository.GetEntities<EOM>().Max(p => p.Date);

            return _repository.GetEntities<EOM>().Where(p => p.Date == currentDate).Select(s => new EomResponse()
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
            var currentEomDate = _repository.GetEntities<EOM>().Max(v => v.Date);

            var current = _repository.GetEntities<EOM>().FirstOrDefault(v => v.Date == currentEomDate);

            if (current == null) return;

            var userGroups =
                _repository.GetEntities<EOMVote>()
                    .Where(p => p.EOMid == current.Id)
                    .ToList()
                    .GroupBy(p => p.NominatedUserId).ToList();

            var maxVotes = userGroups.Max(m => m.Count());

            // TODO: what happens if equal vote for winner
            var winnerId = userGroups.FirstOrDefault(g => g.Count() == maxVotes);

            if (winnerId == null)
                return;

            var eom = _repository.GetEntities<EOM>().FirstOrDefault(p => p.Id == current.Id);

            if (eom == null) return;

            eom.WinnerId = winnerId.Key;
            _repository.Update(eom);

            var newEom = new EOM()
            {
                Date = DateTime.Now,
            };
            _repository.Add(newEom);

            _repository.SaveChanges();
        }

        public int GetNumberOfCurrentEOMVotes()
        {
            var currentEOMDate = _repository.GetEntities<EOM>().Max(p => p.Date);

            var currentEom = _repository.GetEntities<EOM>().FirstOrDefault(e => e.Date == currentEOMDate);



            return currentEom == null ? 0 : currentEom.EOMUserVotes.Count;
        }

        public void AddVote(EomVoteRequest request, string UserId)
        {
            var currentDate = _repository.GetEntities<EOM>().Max(p => p.Date);

            var currentEom = _repository.GetEntities<EOM>().FirstOrDefault(p => p.Date == currentDate);

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

            var currentDate = _repository.GetEntities<EOM>().Max(p => p.Date);

            var currentEom = _repository.GetEntities<EOM>().FirstOrDefault(p => p.Date == currentDate);

            if (currentEom == null)
                return false;

            return _repository.GetEntities<EOMUserVote>().Any(v => v.UserId == userId && v.EOMid == currentEom.Id);
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
