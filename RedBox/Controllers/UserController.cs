using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using RedBox.DataAccess;
using RedBox.Services.Models;
using RedBox.Services.UserServices;
using RedBox.Web.Models;

namespace RedBox.Web.Controllers
{
    public class UserController : ApiController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public List<UserModel> GetUsers()
        {
            var dbUsers = _userService.GetUsers();

            return dbUsers.Select(p => new UserModel() {Id = p.Id, FullName = p.UserInfo.FullName}).ToList();
        }

        [HttpGet]
        public AspNetUser GetUserById(string id)
        {
            return _userService.GetUserById(id);
        }

        [HttpGet]
        public AspNetUser GetUserByUserName(string username)
        {
            return _userService.GetUserByUserName(username);
        }

        [HttpGet]
        [Authorize]
        public UserInfoViewModel UserInfo()
        {
            var user = _userService.GetUserById(User.Identity.GetUserId());

            return new UserInfoViewModel
            {
                Email = user.Email,
                FullName = user.UserInfo.FullName
            };
        }
    }
}
