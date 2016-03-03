using System.Web.Optimization;

namespace RedBox.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js/vendor").Include(
                      "~/Scripts/jquery-2.2.1.js",
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-sanitize.js",
                        "~/Scripts/angular-route.js",
                        "~/Scripts/angular-animate.js",
                        "~/Scripts/angular-aria.js",
                        "~/Scripts/angular-material/angular-material.js",
                        "~/Scripts/angular-messages.js",
                        "~/Scripts/angular-toastr.tpls.js",
                        "~/Scripts/angular-local-storage.js",
                        "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                        "~/Scripts/underscore.js"
                        ));

            //bundles.Add(new ScriptBundle("~/js/app").Include(
            //           "~/app/services/appRouter.js",
            //           "~/app/services/authInterceptorService.js",
            //           "~/app/services/authentification.js",
            //           "~/app/services/userService.js",
            //           "~/app/services/eomService.js",
            //           "~/app/services/eventService.js",
            //           "~/app/services/suggestionService.js",
            //           "~/app/controllers/mainController.js",
            //           "~/app/controllers/suggestionsController.js",
            //           "~/app/controllers/eomController.js",
            //           "~/app/controllers/eventsController.js"

            //           ));

            bundles.Add(new ScriptBundle("~/js/app").IncludeDirectory("~/app/src", "*.js", true));


            bundles.Add(new StyleBundle("~/css/vendor").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/select.css",
                      "~/Content/angular-toastr.css",
                      "~/Content/angular-material.css",
                      "~/Content/select.css",
                      "~/Content/font-awesome.css",
                      "~/Content/loader.css"
                      ));

            bundles.Add(new StyleBundle("~/css/app").Include(
                      "~/Content/Main.css"
                      ));
        }
    }
}
