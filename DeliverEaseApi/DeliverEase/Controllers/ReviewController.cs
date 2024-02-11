using DeliverEase.Models;
using DeliverEase.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliverEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;
        private readonly RestaurantService _restaurantService;

        public ReviewController(ReviewService reviewService, RestaurantService restaurantService)
        {
            _reviewService = reviewService;
            _restaurantService = restaurantService;
        }

        [HttpGet("GetAllReviews")]
        public async Task<ActionResult<List<Review>>> GetAllReviews()
        {
            try
            {
                var reviews = await _reviewService.GetReviewsAsync();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetReviewById")]
        public async Task<ActionResult<Review>> GetReviewById(string id)
        {
            try
            {
                var review = await _reviewService.GetReviewByIdAsync(id);
                if (review == null)
                {
                    return NotFound($"Review with ID {id} not found.");
                }
                return Ok(review);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddReview")]
        public async Task<IActionResult> AddReview(Review review)
        {
            try
            {
                review.Id = null;
                var reviewId = await _reviewService.AddReviewAsync(review);
                await UpdateRestaurantRating(review.RestaurantId);
                return Ok(reviewId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateReview")]
        public async Task<IActionResult> UpdateReview(string id, Review review)
        {
            try
            {
                var existingReview = await _reviewService.GetReviewByIdAsync(id);
                if (existingReview == null)
                {
                    return NotFound($"Review with ID {id} not found.");
                }

                review.RestaurantId=existingReview.RestaurantId;
                review.UserId=existingReview.UserId;
                review.Id = id;
                await _reviewService.UpdateReviewAsync(id, review);
                await UpdateRestaurantRating(review.RestaurantId);

                return Ok("Review updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("DeleteReview")]
        public async Task<IActionResult> DeleteReview(string id)
        {
            try
            {
                var existingReview = await _reviewService.GetReviewByIdAsync(id);
                if (existingReview == null)
                {
                    return NotFound($"Review with ID {id} not found.");
                }

                await _reviewService.DeleteReviewAsync(id);
                await UpdateRestaurantRating(existingReview.RestaurantId);
                return Ok("Review deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetReviewsForUser")]
        public async Task<ActionResult<List<Review>>> GetReviewsForUser(string userId)
        {
            try
            {
                
                var ratings = await _reviewService.GetReviewsForUserAsync(userId);

                //if (ratings == null || ratings.Count == 0)
                //{
                //    return NotFound($"No ratings found for user with ID {userId}.");
                //}

                return Ok(ratings);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetReviewsForRestaurant")]
        public async Task<ActionResult<List<Review>>> GetReviewsForRestaurant(string restaurantId)
        {
            try
            {
                
                var ratings = await _reviewService.GetReviewsForRestaurantAsync(restaurantId);

                if (ratings == null || ratings.Count == 0)
                {
                    return NotFound($"No ratings found for restaurant with ID {restaurantId}.");
                }

                return Ok(ratings);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[HttpGet("UpdateRestaurantRating")]
        private async Task<ActionResult<double>> UpdateRestaurantRating(string restaurantId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsForRestaurantAsync(restaurantId);
                var newRating = _restaurantService.CalculateRestaurantRating(reviews);
                await _restaurantService.UpdateRestaurantRatingAsync(restaurantId, newRating);
                return Ok("Restaurant rating updated successfully.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
