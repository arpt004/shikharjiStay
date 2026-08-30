import { siteContent } from '../Utils/constant';

export function Header({ hotel, adminPanel, onLoginClick }) {
  return (
    <header className="hero-section">
      <nav className="topbar container">
        <div className="brand">{hotel.name}</div>
        <div className="nav-links">
          <a href="#rooms">{siteContent.nav.rooms}</a>
          <a href="#gallery">{siteContent.nav.gallery}</a>
          <a href="#reviews">{siteContent.nav.reviews}</a>
          <a href="#contact">{siteContent.nav.contact}</a>
          <button type="button" className="nav-admin-btn" onClick={onLoginClick}>
            {adminPanel.loggedIn ? 'Logout' : siteContent.admin.login}
          </button>
        </div>
      </nav>
    </header>
  );
}
