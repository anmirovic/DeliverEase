using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;


namespace DeliverEase.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [Required]
        public int Rating { get; set; }
        [Required]
        public string UserId { get; set; } 
        [Required]
        public string RestaurantId { get; set; }
             
    }

}