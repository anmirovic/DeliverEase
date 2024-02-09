using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace DeliverEase.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [JsonIgnore]
        public int Quantity { get; set; }
        [JsonIgnore]
        public double TotalPrice { get; set; }
        public DateTime OrderTime { get; set; }

    
        public string UserId { get; set; }
        public string RestaurantId { get; set; }
        public List<Meal> Meals { get; set; } 
             
    }


}