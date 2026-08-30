import { siteContent } from '../Utils/constant';

export function ContactSection({ hotel }) {
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-grid">
        <div>
          <p className="eyebrow">{siteContent.contactSection.eyebrow}</p>
          <h2>{siteContent.contactSection.title}</h2>
          <p>{hotel.contact.address}</p>
          <p>{hotel.contact.phone}</p>
          <p>{hotel.contact.email}</p>
        </div>

        <div className="contact-card">
          <h3>{siteContent.contactSection.reserveByPhone}</h3>
          <p>{siteContent.contactSection.reserveByPhoneText}</p>
          <a href="tel:+919876543210" className="primary-btn">{siteContent.contactSection.callNow}</a>
        </div>
      </div>
    </section>
  );
}
