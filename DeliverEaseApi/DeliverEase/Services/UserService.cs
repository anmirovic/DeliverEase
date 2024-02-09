using System.Collections.Generic;
using System.Threading.Tasks;
using DeliverEase.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;

namespace DeliverEase.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly string _jwtSecret;
        private readonly int _jwtExpirationMinutes = 1440;

      
        public UserService(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
            _jwtSecret = _jwtSecret = GenerateRandomKey(2048);
        }

        private string GenerateRandomKey(int keySize)
        {
                var rsa = new RSACng(keySize);
                RSAParameters parameters = rsa.ExportParameters(true);
                byte[] key = parameters.Modulus;
                return Convert.ToBase64String(key);
        }

        public string GenerateJwtToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Convert.FromBase64String(_jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, userId)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtExpirationMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<User> RegisterUser(User newUser)
        {
            var existingUser = await _users.Find(user => user.Email == newUser.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                throw new Exception("Email is already taken.");
            }

            await _users.InsertOneAsync(newUser);
            return newUser;
        }


        public async Task<string> LoginUser(string email, string password)
        {
            var user = await _users.Find(u => u.Email == email && u.Password == password).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new Exception("Invalid email or password.");
            }

            var token = GenerateJwtToken(user.Id.ToString());
            return token;
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
