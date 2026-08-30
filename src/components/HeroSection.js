import { siteContent } from '../Utils/constant';

export function HeroSection({ hotel }) {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow">{siteContent.hero.eyebrow}</p>
        <h1>{hotel.tagline}</h1>
        <p>{hotel.description}</p>
        <div className="cta-row">
          <a href="#booking" className="primary-btn">{siteContent.hero.bookNow}</a>
          <a href="#gallery" className="secondary-btn">{siteContent.hero.viewGallery}</a>
        </div>
        <ul className="feature-list">
          {hotel.amenities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="hero-card">
        <h3>{siteContent.hero.quickStay}</h3>
        <div className="info-grid">
          <span>{siteContent.hero.checkIn}</span>
          <strong>{siteContent.hero.checkInTime}</strong>
          <span>{siteContent.hero.checkOut}</span>
          <strong>{siteContent.hero.checkOutTime}</strong>
          <span>{siteContent.hero.location}</span>
          <strong>{siteContent.hero.city}</strong>
        </div>
      </div>
    </section>
  );
}
