﻿using System.Collections.Generic;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using RedBox.DataAccess;
using RedBox.Services.EOMService;
using RedBox.Services.SuggestionService;

namespace RedBox.Web.Controllers
{
    [Authorize]
    public class EOMController : BaseController
    {
        private readonly IEOMService _eomService;
        public EOMController(IEOMService eomService)
        {
            _eomService = eomService;
        }

        [HttpGet]
        public EomResponse GetCurrentEOM()
        {
            return _eomService.GetCurrentEOM();
        }

        [HttpGet]
        public List<EomHistoryResponse> GetAllEOMs()
        {
            return _eomService.GetAllEOMs();
        }

        [HttpPost]
        public void AddVote(EomVoteRequest request)
        {
            var userId = UserId;
            _eomService.AddVote(request, userId);
        }

        [HttpGet]
        public bool HasVoted()
        {
            var userId = UserId;
            return _eomService.HasVoted(userId);
        }

        [HttpGet]
        public void EndVote()
        {
            _eomService.EndVote();
        }

        [HttpGet]
        public int GetNumberOfCurrentEOMVotes()
        {
            return _eomService.GetNumberOfCurrentEOMVotes();
        }
    }

   
}
