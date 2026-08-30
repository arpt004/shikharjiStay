import { siteContent } from '../Utils/constant';
import { formatCurrency } from '../Utils/utils';

export function BookingSection({
  rooms,
  today,
  bookingForm,
  setBookingForm,
  bookingStatus,
  onSubmit,
}) {
  return (
    <section id="booking" className="booking-section section-spacing">
      <div className="container booking-layout">
        <div className="booking-card">
          <div className="section-header left-align">
            <p className="eyebrow">{siteContent.booking.eyebrow}</p>
            <h2>{siteContent.booking.title}</h2>
          </div>

          <form onSubmit={onSubmit} className="booking-form">
            <div className="field-row two-col">
              <label>
                {siteContent.booking.guestName}
                <input
                  value={bookingForm.guestName}
                  onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                  placeholder="Your full name"
                />
              </label>
              <label>
                {siteContent.booking.phone}
                <input
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="+91 98xxx"
                />
              </label>
            </div>

            <div className="field-row two-col">
              <label>
                {siteContent.booking.email}
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                {siteContent.booking.roomType}
                <select
                  value={bookingForm.roomType}
                  onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value })}
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.type}>
                      {room.type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="field-row two-col">
              <label>
                {siteContent.booking.checkIn}
                <input
                  type="date"
                  min={today}
                  value={bookingForm.checkIn}
                  onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                />
              </label>
              <label>
                {siteContent.booking.checkOut}
                <input
                  type="date"
                  min={bookingForm.checkIn || today}
                  value={bookingForm.checkOut}
                  onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                />
              </label>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={bookingForm.payNow}
                onChange={(e) => setBookingForm({ ...bookingForm, payNow: e.target.checked })}
              />
              {siteContent.booking.payNowLabel}
            </label>

            {bookingStatus && <div className="status-box">{bookingStatus}</div>}

            <button type="submit" className="primary-btn full-width">{siteContent.booking.confirmBooking}</button>
          </form>
        </div>

        <aside className="booking-summary">
          <h3>{siteContent.booking.summaryTitle}</h3>
          <div className="summary-line">
            <span>{siteContent.booking.selectedRoom}</span>
            <strong>{bookingForm.roomType}</strong>
          </div>
          <div className="summary-line">
            <span>{siteContent.booking.price}</span>
            <strong>
              {formatCurrency(rooms.find((room) => room.type === bookingForm.roomType)?.price || 0)}
            </strong>
          </div>
          <div className="summary-line">
            <span>{siteContent.booking.checkIn}</span>
            <strong>{bookingForm.checkIn || '—'}</strong>
          </div>
          <div className="summary-line">
            <span>{siteContent.booking.checkOut}</span>
            <strong>{bookingForm.checkOut || '—'}</strong>
          </div>
          <div className="summary-line">
            <span>{siteContent.booking.paidNow}</span>
            <strong>{bookingForm.payNow ? siteContent.booking.yes : siteContent.booking.no}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
