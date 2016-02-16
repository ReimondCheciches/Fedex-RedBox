using System;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace RedBox.Web.Controllers
{
    public class BaseController : ApiController
    {
        protected string UserId
        {
            get
            {
                var userId = User.Identity.GetUserId();

                if (string.IsNullOrEmpty(userId))
                    throw new UnauthorizedAccessException("User.Identity.GetUserId returns null");

                return User.Identity.GetUserId();
            }
        }
    }
}