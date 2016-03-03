using Microsoft.Practices.Unity;
using RedBox.Services.EventService;
using RedBox.Services.SuggestionService;
using System;
using System.Web.Http;
using RedBox.Services.UserServices;
using Unity.WebApi;
using RedBox.DataAccess.Repositories;
using RedBox.Services.EOMService;

namespace RedBox.Web
{
    public static class UnityConfig
    {

        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        ///// <summary>
        ///// Gets the configured Unity container.
        ///// </summary>
        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below. Make sure to add a Microsoft.Practices.Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your types here
            container.RegisterType<IRepository, Repository>();
            container.RegisterType<ISuggestionService, SuggestionService>();
            container.RegisterType<IUserService, UserService>();
            container.RegisterType<IEOMService, EOMService>();
            container.RegisterType<IEventService, EventService>();
            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
        public static void RegisterComponents()
        {


            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers
            container.RegisterType<IRepository, Repository>();
            container.RegisterType<ISuggestionService, SuggestionService>();
            container.RegisterType<IUserService, UserService>();
            container.RegisterType<IEOMService, EOMService>();
            container.RegisterType<IEventService, EventService>();
            // e.g. container.RegisterType<ITestService, TestService>();

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);

        }
    }
}