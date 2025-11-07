

import { useState, useEffect } from 'react';
import { Star, Send, Trash2, AlertCircle, ShoppingBag } from 'lucide-react';
import { reviewAPI } from '../services/api';
import { useApp } from '../context/AppContext';

export default function ReviewSection({ productId }) {
  const { isLoggedIn, user } = useApp(); // ✅ Get from Context (no need props)

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getReviewsByProduct(productId);
      setReviews(response.data);

      if (isLoggedIn && user) {
        setUserHasReviewed(
          response.data.some(r => r.userName === `${user.firstName} ${user.lastName}`)
        );
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) return setError('Please login to submit a review');
    if (rating === 0) return setError('Please select a rating');
    if (!comment.trim()) return setError('Please write a comment');

    setLoading(true);
    setError('');

    try {
      await reviewAPI.addReview(productId, { rating, comment });
      alert('✅ Thank you for your review!');
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      let message = 'Failed to submit review';

      if (err.response?.data) {
        if (typeof err.response.data === 'string') message = err.response.data;
        else if (err.response.data.error) message = err.response.data.error;
        else if (err.response.data.message) message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewAPI.deleteReview(reviewId);
      alert('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const handleUpdate = async (reviewId) => {
    if (!editComment.trim()) return alert('Please enter a comment.');
    try {
      await reviewAPI.updateReview(reviewId, { comment: editComment });
      alert('✅ Review updated successfully!');
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      alert('Failed to update review');
    }
  };

  const renderStars = (count, interactive = false) =>
    [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition`}
        >
          <Star
            className={`w-6 h-6 ${
              starValue <= (interactive ? hoverRating || rating : count)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });

  const ratingDistribution = reviews.reduce(
    (acc, review) => ({ ...acc, [review.rating]: (acc[review.rating] || 0) + 1 }),
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };

  return (
    <div className="mt-12">
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

        {/* ✅ Rating Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:border-r md:border-blue-200 md:pr-8">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {getAverageRating()}
              </div>
              <div className="flex justify-center mb-3">
                {renderStars(Math.round(getAverageRating()))}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            <div className="flex-1 w-full">
              <h3 className="font-semibold text-gray-700 mb-3">Rating Distribution</h3>

              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingDistribution[star];
                const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium w-12 text-gray-700">{star} ★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-3"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm w-16 text-right text-gray-600 font-medium">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ✅ Alert if not logged in */}
        {!isLoggedIn && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Login Required</h3>
              <p className="text-sm">Please login to submit a review.</p>
            </div>
          </div>
        )}

        {/* ✅ User Already Reviewed */}
        {isLoggedIn && userHasReviewed && (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Review Submitted</h3>
              <p className="text-sm">Thank you! You have already reviewed this product.</p>
            </div>
          </div>
        )}

        {/* ✅ Write Review Form */}
        {isLoggedIn && !userHasReviewed && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              Write a Review
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-800 rounded-lg flex gap-3">
                <AlertCircle className="w-6 h-6 mt-1" />
                <div>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Rating *
                </label>
                <div className="flex gap-2">{renderStars(rating, true)}</div>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                placeholder="Share your experience..."
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* ✅ Reviews List */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">All Reviews ({reviews.length})</h3>

          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">No reviews yet</h3>
              <p className="text-gray-500">Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{review.userName}</h4>
                      <div className="flex gap-1 my-2">{renderStars(review.rating)}</div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>

                  {isLoggedIn &&
                    user &&
                    review.userName === `${user.firstName} ${user.lastName}` && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingReview(review.id);
                            setEditComment(review.comment);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                </div>

                <p className="text-gray-700 mt-3">{review.comment}</p>

                {editingReview === review.id && (
                  <div className="mt-4 bg-gray-50 border rounded-lg p-4">
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-3"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => setEditingReview(null)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(review.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

