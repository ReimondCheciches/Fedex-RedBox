using System;
using System.Linq;

namespace RedBox.DataAccess.Repositories
{
    public interface IRepository
    {
        IQueryable<T> GetEntities<T>() where T : class;

        void Add<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        void Update<T>(T entity) where T : class;

        void Detach<T>(T entity) where T : class;

        string GetEntityType(Type type);

        void SaveChanges();
    }
}
