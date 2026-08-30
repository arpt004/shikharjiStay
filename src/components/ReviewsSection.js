import { siteContent } from '../Utils/constant';

export function ReviewsSection({ reviews, reviewForm, setReviewForm, onSubmit, adminPanel }) {
  return (
    <section id="reviews" className="container section-spacing">
      <div className="section-header left-align">
        <p className="eyebrow">{siteContent.reviewsSection.eyebrow}</p>
        <h2>{siteContent.reviewsSection.title}</h2>
      </div>

      <div className="reviews-layout">
        <form onSubmit={onSubmit} className="review-form">
          <label>
            {siteContent.reviewsSection.name}
            <input
              value={reviewForm.name}
              onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
              placeholder="Your name"
            />
          </label>
          <label>
            {siteContent.reviewsSection.review}
            <textarea
              value={reviewForm.content}
              onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
              placeholder="Write your review here..."
            />
          </label>
          <button type="submit" className="primary-btn">{siteContent.reviewsSection.submit}</button>
        </form>

        <div className="reviews-list">
          {reviews.map((review) => (
            <article className="review-item" key={review.id}>
              <div className="review-topline">
                <strong>{review.user_name || siteContent.reviewsSection.guest}</strong>
                {review.flagged && <span className="flag-badge">{siteContent.reviewsSection.flagged}</span>}
              </div>
              <p>{review.content}</p>
              {review.admin_reply && (
                <div className="admin-reply">
                  {siteContent.reviewsSection.admin}: {review.admin_reply}
                </div>
              )}
              {adminPanel.loggedIn && review.flagged && (
                <div className="admin-note">{siteContent.admin.flaggedReviewsCannotBeDeleted}</div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
