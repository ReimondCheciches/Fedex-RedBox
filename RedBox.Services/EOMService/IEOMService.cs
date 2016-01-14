using System.Collections.Generic;
using RedBox.DataAccess;

namespace RedBox.Services.EOMService
{
    public interface IEOMService
    {
        EOM GetCurrentPeriod();
        List<EOM> GetAllEOMs(); 
        void AddVote(EOMVote vote);
        void AddUserVote(EOMUserVote userVote);
        void RemoveUserVote(int eomId, string userId);
        void EndVote(int eomId);
        int GetNumberOfVotesCurrentPeriod();

    }
}
