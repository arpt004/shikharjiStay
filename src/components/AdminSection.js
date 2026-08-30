import { siteContent } from '../Utils/constant';

export function AdminSection({
  hotel,
  setHotel,
  adminPanel,
  rooms,
  reviews,
  galleryForm,
  setGalleryForm,
  onLogin,
  onHotelSave,
  onRoomPriceChange,
  onRoomUpdate,
  onGallerySubmit,
  onGalleryFileSelect,
  onReviewFlagToggle,
  onReviewReply,
  onReviewDelete,
  setAdminPanel,
}) {
  return (
    <section id="admin-panel-section" className="admin-section container section-spacing">
      <div className="section-header left-align">
        <p className="eyebrow">{siteContent.admin.eyebrow}</p>
        <h2>{siteContent.admin.title}</h2>
      </div>

      <div className="admin-login-box">
        {!adminPanel.loggedIn ? (
          <>
            <input
              value={adminPanel.username}
              onChange={(e) => setAdminPanel({ ...adminPanel, username: e.target.value })}
              placeholder={siteContent.admin.username}
            />
            <input
              type="password"
              value={adminPanel.password}
              onChange={(e) => setAdminPanel({ ...adminPanel, password: e.target.value })}
              placeholder={siteContent.admin.password}
            />
            <button className="primary-btn" onClick={onLogin}>{siteContent.admin.login}</button>
          </>
        ) : (
          <div className="admin-panel">
            <div className="admin-section-block">
              <h3>Hotel info</h3>
              <input
                value={hotel.name || ''}
                onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
                placeholder="Hotel name"
              />
              <input
                value={hotel.tagline || ''}
                onChange={(e) => setHotel({ ...hotel, tagline: e.target.value })}
                placeholder="Tagline"
              />
              <textarea
                value={hotel.description || ''}
                onChange={(e) => setHotel({ ...hotel, description: e.target.value })}
                placeholder="Description"
              />
              <input
                value={hotel.contact?.phone || ''}
                onChange={(e) => setHotel({ ...hotel, contact: { ...hotel.contact, phone: e.target.value } })}
                placeholder="Phone"
              />
              <input
                value={hotel.contact?.email || ''}
                onChange={(e) => setHotel({ ...hotel, contact: { ...hotel.contact, email: e.target.value } })}
                placeholder="Email"
              />
              <input
                value={hotel.contact?.address || ''}
                onChange={(e) => setHotel({ ...hotel, contact: { ...hotel.contact, address: e.target.value } })}
                placeholder="Address"
              />
              <button type="button" className="primary-btn" onClick={onHotelSave}>
                Save hotel info
              </button>
            </div>

            <div className="admin-section-block">
              <h3>{siteContent.admin.updateRoomPrice}</h3>
              {rooms.map((room) => (
                <div key={room.id} className="admin-room-row">
                  <span>{room.type}</span>
                  <input
                    type="number"
                    value={room.price}
                    onChange={(e) => onRoomPriceChange(room.id, { price: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    value={room.availability}
                    min="0"
                    onChange={(e) => onRoomPriceChange(room.id, { availability: Number(e.target.value) })}
                  />
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => onRoomUpdate(room.id, { price: room.price, availability: room.availability })}
                  >
                    Update
                  </button>
                </div>
              ))}
            </div>

            <div className="admin-section-block">
              <h3>{siteContent.admin.addGallery}</h3>
              <input
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                placeholder={siteContent.admin.imageTitle}
              />
              <input
                type="file"
                accept="image/*"
                onChange={onGalleryFileSelect}
              />
              <button className="primary-btn" onClick={onGallerySubmit}>{siteContent.admin.addImage}</button>
            </div>

            <div className="admin-section-block">
              <h3>{siteContent.admin.reviewModeration}</h3>
              {reviews.map((review) => (
                <div key={review.id} className="review-admin-row">
                  <p>{review.content}</p>
                  <div className="review-actions">
                    <button onClick={() => onReviewFlagToggle(review.id, !review.flagged)}>
                      {review.flagged ? siteContent.admin.unflag : siteContent.admin.flag}
                    </button>
                    <input
                      placeholder={siteContent.admin.reply}
                      onBlur={(e) => onReviewReply(review.id, e.target.value)}
                      defaultValue={review.admin_reply || ''}
                    />
                    <button onClick={() => onReviewDelete(review.id)} className="danger-btn">
                      {siteContent.admin.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
