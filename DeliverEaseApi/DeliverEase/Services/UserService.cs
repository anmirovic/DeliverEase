using System.Collections.Generic;
using System.Threading.Tasks;
using DeliverEase.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using BCrypt.Net;
using DeliverEase.Helpers;
using Amazon.Runtime.Internal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliverEase.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private JwtService jwtService { get; set; }

        public UserService(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
            jwtService = new JwtService();
        }

        public async Task<User> RegisterUser(User newUser)
        {
            var existingUser = await _users.Find(user => user.Email == newUser.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                throw new Exception("Email is already taken.");
            }
            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
            await _users.InsertOneAsync(newUser);
            return newUser;
        }


        public async Task<string> LoginUser(string email, string password)
        {
            var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new Exception("Invalid email");
            }

            if (!BCrypt.Net.BCrypt.Verify(password, user.Password)) throw new Exception("Invalid password");

            var token = jwtService.Generate(user.Id.ToString());

            return token;
        }
        public async Task<User> GetUser(string jwt)
        {
            var token = jwtService.Verify(jwt);

            string userId = token.Issuer;

            return await _users.Find(user => user.Id == userId).FirstOrDefaultAsync();

        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _users.Find(user => true).ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            return await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserAsync(string username)
        {
            return await _users.Find(user => user.Username == username).FirstOrDefaultAsync();
        }
        

        public async Task UpdateUserAsync(string id, User userIn)
        {
            await _users.ReplaceOneAsync(user => user.Id == id, userIn);
        }

        public async Task DeleteUserAsync(string id)
        {
            await _users.DeleteOneAsync(user => user.Id == id);
        }
    }
}
