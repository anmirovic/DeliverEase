using System.Collections.Generic;
using System.Threading.Tasks;
using DeliverEase.Models;
using MongoDB.Driver;
using MongoDB.Bson;

namespace DeliverEase.Services
{
    public class RestaurantService
    {
        private readonly IMongoCollection<Restaurant> _restaurants;

        public RestaurantService(IMongoDatabase database)
        {
            _restaurants = database.GetCollection<Restaurant>("Restaurants");
        }

        public async Task<List<Restaurant>> GetRestaurantsAsync()
        {
            return await _restaurants.Find(restaurant => true).ToListAsync();
        }

        public async Task<Restaurant> GetRestaurantByIdAsync(string id)
        {
            return await _restaurants.Find(restaurant => restaurant.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Restaurant> CreateRestaurantAsync(Restaurant restaurant)
        {
            foreach (var meal in restaurant.Meals)
            {
                if (meal.Id == null)
                {
                    meal.Id = ObjectId.GenerateNewId().ToString();
                }
            }
            await _restaurants.InsertOneAsync(restaurant);
            return restaurant;
        }

        public async Task UpdateRestaurantAsync(string id, Restaurant restaurantIn)
        {
            await _restaurants.ReplaceOneAsync(restaurant => restaurant.Id == id, restaurantIn);
        }

        public async Task DeleteRestaurantAsync(string id)
        {
            await _restaurants.DeleteOneAsync(restaurant => restaurant.Id == id);
        }

        public double CalculateRestaurantRating(List<Review> reviews)
        {
            if (reviews == null || reviews.Count == 0)
            {
                return 0; 
            }
           
            double totalRating = 0;
            foreach (var review in reviews)
            {
                totalRating += review.Rating;
            }

            double averageRating = totalRating / reviews.Count;

            return averageRating;
        }

        public async Task UpdateRestaurantRatingAsync(string restaurantId, double newRating)
        {
            var filter = Builders<Restaurant>.Filter.Eq(r => r.Id, restaurantId);
            var update = Builders<Restaurant>.Update.Set(r => r.Rating, newRating);

            await _restaurants.UpdateOneAsync(filter, update);
        }

        public async Task<string> AddMealToRestaurantAsync(string restaurantId, Meal meal)
        {
            var restaurant = await GetRestaurantByIdAsync(restaurantId);
            if (restaurant != null)
            {
               
                meal.Id = ObjectId.GenerateNewId().ToString();
                restaurant.Meals.Add(meal);
                await UpdateRestaurantAsync(restaurantId, restaurant);
                return meal.Id;
            }
            else
            {
                throw new Exception($"Restaurant with ID {restaurantId} not found.");
            }
        }

        
        public async Task DeleteMealFromRestaurantAsync(string restaurantId, string mealId)
        {
            var restaurant = await GetRestaurantByIdAsync(restaurantId);
            if (restaurant != null)
            {
                var mealToRemove = restaurant.Meals.Find(m => m.Id == mealId);
                if (mealToRemove != null)
                {
                    restaurant.Meals.Remove(mealToRemove);
                    await UpdateRestaurantAsync(restaurantId, restaurant);
                }
                else
                {
                    throw new Exception($"Meal with ID {mealId} not found in restaurant with ID {restaurantId}.");
                }
            }
            else
            {
                throw new Exception($"Restaurant with ID {restaurantId} not found.");
            }
        }

    
        public async Task<Meal> GetMealByIdAsync(string restaurantId, string mealId)
        {
            var restaurant = await GetRestaurantByIdAsync(restaurantId);
            if (restaurant != null)
            {
                return restaurant.Meals.Find(m => m.Id == mealId);
            }
            else
            {
                throw new Exception($"Restaurant with ID {restaurantId} not found.");
            }
        }

        public async Task<List<Meal>> GetAllMealsInRestaurantAsync(string restaurantId)
        {
            var restaurant = await GetRestaurantByIdAsync(restaurantId);
            if (restaurant != null)
            {
                return restaurant.Meals;
            }
            else
            {
                throw new Exception($"Restaurant with ID {restaurantId} not found.");
            }
        }


        public async Task<List<Restaurant>> GetRestaurantsSortedByRatingAsync(bool ascending = false)
        {
            var sortDefinition = ascending ? Builders<Restaurant>.Sort.Ascending(r => r.Rating) :
                                            Builders<Restaurant>.Sort.Descending(r => r.Rating);
            return await _restaurants.Find(r => true).Sort(sortDefinition).ToListAsync();
        }


    }
}
