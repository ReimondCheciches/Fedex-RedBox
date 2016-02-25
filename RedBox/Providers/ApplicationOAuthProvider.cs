﻿using System;
using System.Collections.Generic;
using System.Configuration;
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
                string userName = null;

                userName = "alexandru.mahu";

                //var ssoBaseUrl = ConfigurationManager.AppSettings["ssoBaseUrl"];

                //var webRequest = WebRequest.Create(ssoBaseUrl + "/Pages/SSO.aspx") as HttpWebRequest;
                //webRequest.CookieContainer = new CookieContainer();

                //foreach (var cookieFromRequest in context.Request.Cookies.ToList())
                //{
                //    var cookie = new Cookie(cookieFromRequest.Key, cookieFromRequest.Value);

                //    webRequest.CookieContainer.Add(new Uri(ssoBaseUrl), cookie);

                //    if (cookieFromRequest.Key == "userInfo")
                //    {
                //        userName = cookieFromRequest.Value.Split('=')[1];
                //    }
                //}

                //webRequest.AllowAutoRedirect = false;

                //var response = (HttpWebResponse)webRequest.GetResponse();

                //var status = response.StatusCode;

                //if (status != HttpStatusCode.OK || string.IsNullOrEmpty(userName))
                //{
                //    context.SetError("invalid_grant", "The user name or password is incorrect.");
                //    return;
                //}



                var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

                //ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);       
                ApplicationUser user = await userManager.FindByNameAsync(userName);

                if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                }

                ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager,
                   OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                AuthenticationProperties properties = CreateProperties(user.UserName);
                AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
                context.Validated(ticket);
                context.Request.Context.Authentication.SignIn(cookiesIdentity);

            }
            catch (Exception e)
            {

                var ex = e;
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