using System.Collections.Generic;
using System.Linq;
using RedBox.DataAccess;
using RedBox.DataAccess.Repositories;

namespace RedBox.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly IRepository _repository;

        public UserService(IRepository repository)
        {
            _repository = repository;
        }

        public List<AspNetUser> GetUsers()
        {
            return _repository.GetEntities<AspNetUser>().Where(u => u.UserInfo.IsEmployed == true && (u.UserInfo.CanBeVotedEOM.HasValue && u.UserInfo.CanBeVotedEOM.Value)).ToList();
        }

        public AspNetUser GetUserById(string id)
        {
            return _repository.GetEntities<AspNetUser>().FirstOrDefault(u => u.Id.Equals(id));
        }

        public AspNetUser GetUserByUserName(string username)
        {
            return _repository.GetEntities<AspNetUser>().FirstOrDefault(u => u.Id.Equals(username));
        }
    }
}
