//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RedBox.DataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class AspNetUser
    {
        public AspNetUser()
        {
            this.AspNetUserClaims = new HashSet<AspNetUserClaim>();
            this.AspNetUserLogins = new HashSet<AspNetUserLogin>();
            this.EOMs = new HashSet<EOM>();
            this.EOMUserVotes = new HashSet<EOMUserVote>();
            this.EOMVotes = new HashSet<EOMVote>();
            this.SuggestionVotes = new HashSet<SuggestionVote>();
            this.AspNetRoles = new HashSet<AspNetRole>();
            this.UserEvents = new HashSet<UserEvent>();
            this.Events = new HashSet<Event>();
        }
    
        public string Id { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public Nullable<System.DateTime> LockoutEndDateUtc { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }
        public string UserName { get; set; }
    
        public virtual ICollection<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual ICollection<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual ICollection<EOM> EOMs { get; set; }
        public virtual ICollection<EOMUserVote> EOMUserVotes { get; set; }
        public virtual ICollection<EOMVote> EOMVotes { get; set; }
        public virtual ICollection<SuggestionVote> SuggestionVotes { get; set; }
        public virtual UserInfo UserInfo { get; set; }
        public virtual ICollection<AspNetRole> AspNetRoles { get; set; }
        public virtual ICollection<UserEvent> UserEvents { get; set; }
        public virtual ICollection<Event> Events { get; set; }
    }
}
