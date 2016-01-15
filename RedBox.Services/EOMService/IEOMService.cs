using System.Collections.Generic;
using RedBox.DataAccess;

namespace RedBox.Services.EOMService
{
    public interface IEOMService
    {
        EomResponse GetCurrentEOM();
        List<EomHistoryResponse> GetAllEOMs();
        void AddVote(EOMVote vote, EOMUserVote userVote);
        void RemoveUserVote(int eomId, string userId);
        void EndVote();
        int GetNumberOfCurrentEOMVotes();

        void AddVote(EomVoteRequest request, string UserId);
        bool HasVoted(string userId);
    }
}
