using System.Collections.Generic;
using RedBox.DataAccess;

namespace RedBox.Services.UserServices
{
    public interface IUserService
    {
        List<AspNetUser> GetUsers();
        AspNetUser GetUserById(string id);
        AspNetUser GetUserByUserName(string username);
    }
}
