using DeliverEase.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliverEase.Services
{
    public class ReviewService
    {
        private readonly IMongoCollection<Review> _reviews;

        public ReviewService(IMongoDatabase database)
        {
            _reviews = database.GetCollection<Review>("Reviews");
        }
        
        public async Task<List<Review>> GetReviewsAsync()
        {
            return await _reviews.Find(review => true).ToListAsync();
        }

        public async Task<Review> GetReviewByIdAsync(string id)
        {
            return await _reviews.Find(review => review.Id == id).FirstOrDefaultAsync();
        }

        public async Task<string> AddReviewAsync(Review review)
        {
            await _reviews.InsertOneAsync(review);
            return review.Id;
        }

        public async Task UpdateReviewAsync(string id, Review reviewIn)
        {
            await _reviews.ReplaceOneAsync(review => review.Id == id, reviewIn);
        }

        public async Task DeleteReviewAsync(string id)
        {
            await _reviews.DeleteOneAsync(review => review.Id == id);
        }

        public async Task DeleteReviewsForRestaurantAsync(string restaurantId)
        {
            var reviewsFilter = Builders<Review>.Filter.Eq(r => r.RestaurantId, restaurantId);
            var reviewsToDelete = await _reviews.Find(reviewsFilter).ToListAsync();

            foreach (var review in reviewsToDelete)
            {
                await _reviews.DeleteOneAsync(r => r.Id == review.Id);
            }
        }

        public async Task<List<Review>> GetReviewsForUserAsync(string userId)
        {
            
            var reviews = await _reviews.Find(review => review.UserId == userId).ToListAsync();
            
            return reviews;
        }

        public async Task<List<Review>> GetReviewsForRestaurantAsync(string restaurantId)
        {
            
            var reviews = await _reviews.Find(review => review.RestaurantId == restaurantId).ToListAsync();
            
            return reviews;
        }

    }
}
