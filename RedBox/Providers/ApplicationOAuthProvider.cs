using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using RedBox.Web.Models;

namespace RedBox.Web.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            try
            {
                var ssoMessage = "";
                var userName = GetUsernameViaSSO(context, out ssoMessage);

                if (string.IsNullOrWhiteSpace(userName))
                {
                    context.SetError("invalid_grant", ssoMessage);
                    return;
                }

                var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

                var user = await userManager.FindByNameAsync(userName);

                if (user == null)
                {
                    context.SetError("invalid_grant", "User not found in Evaluations");
                    return;
                }

                var oAuthIdentity = await user.GenerateUserIdentityAsync(userManager,
                   OAuthDefaults.AuthenticationType);
                var cookiesIdentity = await user.GenerateUserIdentityAsync(userManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                var properties = CreateProperties(user.UserName);
                var ticket = new AuthenticationTicket(oAuthIdentity, properties);
                context.Validated(ticket);
                context.Request.Context.Authentication.SignIn(cookiesIdentity);

            }
            catch (Exception e)
            {

                var ex = e;
            }
        }

        private static string GetUsernameViaSSO(OAuthGrantResourceOwnerCredentialsContext context, out string message)
        {
            message = "";

            try
            {
                string userName = null;
                var ssoBaseUrl = ConfigurationManager.AppSettings["ssoBaseUrl"];

                var webRequest = (HttpWebRequest)WebRequest.Create(ssoBaseUrl + "/Pages/SSO.aspx");

                webRequest.CookieContainer = new CookieContainer();

                foreach (var cookieFromRequest in context.Request.Cookies.ToList())
                {
                    var cookie = new Cookie(cookieFromRequest.Key, cookieFromRequest.Value);

                    webRequest.CookieContainer.Add(new Uri(ssoBaseUrl), cookie);

                }

                var response = (HttpWebResponse)webRequest.GetResponse();

                var status = response.StatusCode;

                if (status != HttpStatusCode.OK)
                {
                    message = "HttpStatusCode not OK for Timesheet";
                    return null;
                }

                using (var resp = webRequest.GetResponse())
                {
                    var stream = resp.GetResponseStream();
                    if (stream != null)
                    {
                        userName = new StreamReader(stream).ReadToEnd();
                    }
                }

                return userName;
            }
            catch (Exception e)
            {
                message = "Exception: " + e.Message;
                return null;
            }
        }


        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string userName)
        {
            IDictionary<string, string> data = new Dictionary<string, string>
            {
                { "userName", userName }
            };
            return new AuthenticationProperties(data);
        }
    }
}