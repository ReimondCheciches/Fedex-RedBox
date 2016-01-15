using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Linq;

namespace RedBox.DataAccess.Repositories
{
    public class Repository : IRepository
    {
        private static readonly List<EntityState> Changed = new List<EntityState> { EntityState.Added, EntityState.Deleted, EntityState.Modified };

        private readonly RedBoxEntities _context;
        private bool _isDisposed;


        public Repository()
        {
            _context = new RedBoxEntities();
        }

        public IQueryable<T> GetEntities<T>() where T : class
        {
            CheckDispose();
            return _context.Set<T>();
        }

        private void CheckDispose()
        {
            if (_isDisposed)
                throw new ObjectDisposedException("Repository");
        }

        public void Add<T>(T entity) where T : class
        {
            CheckDispose();
            _context.Set<T>().Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            CheckDispose();
            _context.Entry(entity).State = EntityState.Deleted;
        }

        public void Update<T>(T entity) where T : class
        {
            CheckDispose();
            _context.Entry(entity).State = EntityState.Modified;
        }

        public void Detach<T>(T entity) where T : class
        {
            CheckDispose();
            _context.Entry(entity).State = EntityState.Detached;
        }

        public string GetEntityType(Type type)
        {
            return ObjectContext.GetObjectType(type).Name;
        }

        private string GetQueryText(string procedureName, List<IDataParameter> @params)
        {
            string[] paramName = @params.Select(p => "@" + p.ParameterName).ToArray();
            string paramText = string.Join(",", paramName);

            string queryText = string.Format("EXEC {0},{1}", procedureName, paramText);
            return queryText;
        }

        public void Dispose()
        {
            if (_isDisposed) return;

            _context.Dispose();
            _isDisposed = true;
        }

        public void SaveChanges()
        {
            CheckDispose();
            _context.SaveChanges();
        }
    }
}
