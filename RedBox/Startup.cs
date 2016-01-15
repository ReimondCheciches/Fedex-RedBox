using Microsoft.Owin;
using Owin;
using RedBox.Web;

[assembly: OwinStartup(typeof(Startup))]

namespace RedBox.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            UnityConfig.RegisterComponents();
        }
    }
}
