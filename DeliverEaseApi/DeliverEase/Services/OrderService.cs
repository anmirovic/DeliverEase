using System.Collections.Generic;
using System.Threading.Tasks;
using DeliverEase.Models;
using MongoDB.Driver;

namespace DeliverEase.Services
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _orders;
        private readonly RestaurantService _restaurantService;
        private readonly UserService _userService;

        public OrderService(IMongoDatabase database, RestaurantService restaurantService, UserService userService)
        {
            _orders = database.GetCollection<Order>("Orders");
            _restaurantService = restaurantService;
            _userService = userService;
        }

        public async Task<List<Order>> GetOrdersAsync()
        {
            return await _orders.Find(order => true).ToListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(string id)
        {
            return await _orders.Find(order => order.Id == id).FirstOrDefaultAsync();

        }

        public async Task<List<Order>> GetOrdersForUserAsync(string userId)
        {
            var orders = await _orders.Find(order => order.UserId == userId).ToListAsync();
            return orders;
        }

        public async Task<string> CreateOrderAsync(string restaurantId, string userId, List<string> mealIds)
        {
            // var restaurant = await _restaurantService.GetRestaurantByIdAsync(restaurantId);
            // if (restaurant == null)
            // {
            //     return false;
            // }

            var restaurantMeals = await _restaurantService.GetAllMealsInRestaurantAsync(restaurantId);

            var totalQuantity = 0;
            var totalPrice = 0.0;

            foreach (var mealId in mealIds)
            {
                var meal = restaurantMeals.FirstOrDefault(m=> m.Id==mealId);
                if (meal == null)
                {
                    return null;
                }
                totalQuantity++;
                totalPrice += meal.Price;
            }

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            var newOrder = new Order
            {
                RestaurantId = restaurantId,
                UserId = userId,
                Quantity = totalQuantity,
                TotalPrice = totalPrice, 
                Meals = new List<Meal>(),
                OrderTime = DateTime.Now
            };

            foreach (var mealId in mealIds)
            {
                var meal = restaurantMeals.FirstOrDefault(m => m.Id == mealId);                
                if (meal != null)
                {
                    newOrder.Meals.Add(meal);
                }
            }

            await _orders.InsertOneAsync(newOrder);

            return newOrder.Id;
        }


        public async Task UpdateOrderAsync(string id, List<string> mealIds)
        {

            var order = await GetOrderByIdAsync(id);
            if (order == null)
            {
                throw new Exception($"Order with ID {id} not found.");
            }

            var restaurant = await _restaurantService.GetRestaurantByIdAsync(order.RestaurantId);
            if (restaurant == null)
            {
                throw new Exception($"Restaurant with ID {order.RestaurantId} not found.");
            }

            var meals = new List<Meal>();

            foreach (var mealId in mealIds)
            {
                var meal = await _restaurantService.GetMealByIdAsync(restaurant.Id, mealId);
                if (meal != null)
                {
                    meals.Add(meal);
                }
            }

            var quantity = meals.Count;

            var totalPrice = meals.Sum(meal => meal.Price);


            var orderTime = DateTime.Now;

            var filter = Builders<Order>.Filter.Eq(order => order.Id, id);
            var update = Builders<Order>.Update
                .Set(order => order.Meals, meals)
                .Set(order => order.Quantity, quantity)
                .Set(order => order.TotalPrice, totalPrice)
                .Set(order => order.OrderTime, orderTime);

            await _orders.UpdateOneAsync(filter, update);
        }


        public async Task DeleteOrderAsync(string id)
        {
            await _orders.DeleteOneAsync(order => order.Id == id);
        }

    }
}
