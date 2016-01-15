using System.Collections.Generic;
using System.Web.Http;
using RedBox.DataAccess;
using RedBox.Services.EOMService;
using RedBox.Services.SuggestionService;

namespace RedBox.Web.Controllers
{
    public class EOMController : ApiController
    {
        private readonly IEOMService _eomService;
        public EOMController(IEOMService eomService)
        {
            _eomService = eomService;
        }

        [HttpGet]
        public EOM GetCurrentEOM()
        {
            return _eomService.GetCurrentEOM();
        }

        [HttpGet]
        public List<EOM> GetAllEOMs()
        {
            return _eomService.GetAllEOMs();
        }

        [HttpGet]
        public void AddVote(EOMVote vote, EOMUserVote userVote)
        {
            _eomService.AddVote(vote, userVote);
        }

        [HttpGet]
        public void EndVote(int eomId)
        {
            _eomService.EndVote(eomId);
        }

        [HttpGet]
        public int GetNumberOfCurrentEOMVotes()
        {
            return _eomService.GetNumberOfCurrentEOMVotes();
        }
    }
}
