﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class RedBoxEntities : DbContext
    {
        public RedBoxEntities()
            : base("name=RedBoxEntities1")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<EOM> EOMs { get; set; }
        public virtual DbSet<EOMUserVote> EOMUserVotes { get; set; }
        public virtual DbSet<EOMVote> EOMVotes { get; set; }
        public virtual DbSet<Suggestion> Suggestions { get; set; }
        public virtual DbSet<SuggestionVote> SuggestionVotes { get; set; }
        public virtual DbSet<UserInfo> UserInfoes { get; set; }
    }
}
