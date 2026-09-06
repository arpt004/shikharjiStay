import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { getHotels, loginUser, registerUser, API_BASE_URL } from './communication';
const today = new Date().toISOString().slice(0, 10);
const demoHotels = [
  { id: 1, name: 'The Fern House', city: 'Mount Abu, Rajasthan', description: 'A quiet hillside stay framed by cedar trees, warm light, and slow mornings.', rating: 4.8, reviews: 126, price: 4200, image: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=85', tags: ['Breakfast included', 'Mountain view'], rooms: [{ id: 11, type: 'Garden King', capacity: 2, base_price: 4200 }, { id: 12, type: 'Family Suite', capacity: 4, base_price: 6800 }] },
  { id: 2, name: 'Ananta Courtyard', city: 'Udaipur, Rajasthan', description: 'A sun-washed courtyard retreat for unhurried days beside the lake.', rating: 4.7, reviews: 89, price: 5600, image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1200&q=85', tags: ['Lake access', 'Pool'], rooms: [{ id: 21, type: 'Courtyard Room', capacity: 2, base_price: 5600 }, { id: 22, type: 'Lake Suite', capacity: 3, base_price: 8200 }] },
  { id: 3, name: 'Pine & Stone', city: 'Mussoorie, Uttarakhand', description: 'A characterful mountain hideaway with fireplaces, books, and pine-scented air.', rating: 4.9, reviews: 214, price: 6100, image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=85', tags: ['Fireplace', 'Pet friendly'], rooms: [{ id: 31, type: 'Pine Room', capacity: 2, base_price: 6100 }, { id: 32, type: 'Stone Loft', capacity: 4, base_price: 9400 }] },
];
const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

function App() {
  const [hotels, setHotels] = useState(demoHotels);
  const [page, setPage] = useState('home');
  const [hotel, setHotel] = useState(null);
  const [query, setQuery] = useState({ place: '', checkIn: today, checkOut: '', guests: '2 guests' });
  const [filters, setFilters] = useState({ place: '', maxPrice: 12000 });
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('jainStayUser') || 'null'));
  const [auth, setAuth] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    getHotels().then((data) => {
      if (!data?.length) return;
      setHotels(data.map((item, index) => ({
        ...demoHotels[index % 3],
        ...item,
        image: item.image || (item.images?.[0]?.path ? `${API_BASE_URL}${item.images[0].path}` : demoHotels[index % 3].image),
        price: item.price || item.rooms?.[0]?.base_price || 4200,
        rooms: item.rooms?.length ? item.rooms : demoHotels[index % 3].rooms,
      })));
    }).catch(() => undefined);
  }, []);

  const visibleHotels = useMemo(() => hotels.filter((item) => {
    const place = (filters.place || query.place).toLowerCase();
    return (!place || `${item.name} ${item.city} ${item.address || ''}`.toLowerCase().includes(place)) && item.price <= filters.maxPrice;
  }), [filters, hotels, query.place]);

  const goHome = () => { setPage('home'); setHotel(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const openHotel = (item) => { setHotel(item); setPage('detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const showNotice = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 3500); };
  const search = (event) => { event.preventDefault(); setFilters((old) => ({ ...old, place: query.place })); document.getElementById('stays')?.scrollIntoView({ behavior: 'smooth' }); };
  const submitAuth = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = { name: data.get('name') || 'Guest', email: data.get('email'), password: data.get('password') };

    try {
      const session = auth === 'login' ? await loginUser(payload) : await registerUser(payload);
      localStorage.setItem('jainStayToken', session.token);
      localStorage.setItem('jainStayUser', JSON.stringify(session.user));
      setUser(session.user);
      setAuth(null);
      showNotice('Welcome to jainStay.');
    } catch (error) {
      showNotice(error.message);
    }
  };
  const reserve = (room) => user ? showNotice(`${room.type} selected. Your booking flow is ready.`) : setAuth('login');

  return <div className="app-shell">
    <Header user={user} page={page} onHome={goHome} onTrips={() => setPage('trips')} onSignIn={() => setAuth('login')} onNotice={showNotice} />
    {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}
    {page === 'home' && <Home hotels={visibleHotels} query={query} setQuery={setQuery} filters={filters} setFilters={setFilters} onSearch={search} onHotel={openHotel} />}
    {page === 'detail' && hotel && <Detail hotel={hotel} onBack={goHome} onReserve={reserve} />}
    {page === 'trips' && <Trips user={user} onHome={goHome} onSignOut={() => { localStorage.removeItem('jainStayUser'); localStorage.removeItem('jainStayToken'); setUser(null); setPage('home'); }} />}
    {auth && <Auth mode={auth} onMode={setAuth} onClose={() => setAuth(null)} onSubmit={submitAuth} />}
    {page === 'home' && <Footer />}
  </div>;
}

function Header({ user, page, onHome, onTrips, onSignIn, onNotice }) {
  return <header className="site-header"><button className="wordmark" onClick={onHome}><span>jain</span>Stay<i>.</i></button><nav><button className={page === 'home' ? 'active' : ''} onClick={onHome}>Explore stays</button><button onClick={() => onNotice('Every property is selected for character, comfort, and care.')}>Our standard</button><button onClick={() => onNotice('Partner onboarding is coming soon.')}>List your property</button></nav><div className="header-actions"><button className="currency" onClick={() => onNotice('Currency: INR')}>₹</button>{user ? <button className="profile" onClick={onTrips}><b>{user.name[0]}</b>{user.name}</button> : <button className="outline" onClick={onSignIn}>Sign in</button>}</div></header>;
}

function Home({ hotels, query, setQuery, filters, setFilters, onSearch, onHotel }) {
  return <><main><section className="hero"><div className="hero-image" /><div className="hero-inner content"><p className="eyebrow">STAYS WITH A SENSE OF PLACE</p><h1>Go somewhere<br /><em>worth remembering.</em></h1><p className="hero-copy">Thoughtful hotels, honest hospitality, and the feeling that you found the right place.</p><form className="search-panel" onSubmit={onSearch}><Field label="Where to?" className="destination"><input value={query.place} onChange={(e) => setQuery({ ...query, place: e.target.value })} placeholder="City, landmark, or hotel" /></Field><Field label="Check in"><input type="date" min={today} value={query.checkIn} onChange={(e) => setQuery({ ...query, checkIn: e.target.value })} /></Field><Field label="Check out"><input type="date" min={query.checkIn || today} value={query.checkOut} onChange={(e) => setQuery({ ...query, checkOut: e.target.value })} /></Field><Field label="Guests" className="guests"><select value={query.guests} onChange={(e) => setQuery({ ...query, guests: e.target.value })}><option>2 guests</option><option>1 guest</option><option>3 guests</option><option>4 guests</option></select></Field><button className="search-button" aria-label="Search">→</button></form></div><div className="hero-note">01 <span /> 03 &nbsp;/&nbsp; Rajasthan, India</div></section><section className="intro content"><div><p className="eyebrow dark">THE JAINSTAY EDIT</p><h2>Places that make<br /><i>the journey.</i></h2></div><p>Not just a room for the night. We find the stays with a point of view, a generous host, and a reason to linger a little longer.</p></section><section className="stays content" id="stays"><div className="section-head"><div><p className="eyebrow dark">CURATED FOR YOU</p><h2>Stay somewhere<br /><i>different.</i></h2></div><button className="text-button" onClick={() => setFilters({ place: '', maxPrice: 12000 })}>View all stays ↗</button></div><div className="stay-layout"><aside className="filters"><b>Refine your stay</b><label>Destination<input placeholder="Anywhere" value={filters.place} onChange={(e) => setFilters({ ...filters, place: e.target.value })} /></label><label>Price per night <strong>₹{filters.maxPrice.toLocaleString('en-IN')}</strong><input type="range" min="3000" max="12000" step="500" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })} /></label><hr /><small>Every stay includes our promise: clean rooms, kind hosts, no surprises.</small></aside><div className="hotel-grid">{hotels.map((item) => <article className="hotel-card" key={item.id} onClick={() => onHotel(item)}><div className="hotel-photo"><img src={item.image} alt={item.name} /><span>♡</span></div><div className="hotel-info"><div className="title-row"><div><h3>{item.name}</h3><p>{item.city}</p></div><b>★ {item.rating}</b></div><div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><strong>{money(item.price)} <small>/ night</small></strong><small className="reviews">{item.reviews} reviews</small></div></article>)}</div></div></section><section className="manifesto"><div className="content"><p className="eyebrow">WHY JAINSTAY</p><h2>Good stays leave<br /><i>a little more in you.</i></h2><div className="points">{[['01', 'Chosen with care', 'Small details and sincere hospitality over endless options.'], ['02', 'Made for real life', 'Clear prices, easy booking, and rooms that feel like a welcome.'], ['03', 'Rooted locally', 'Stay closer to the places, people, and stories worth knowing.']].map(([number, title, text]) => <div key={number}><b>{number}</b><strong>{title}</strong><p>{text}</p></div>)}</div></div></section></main></>;
}

function Field({ label, className = '', children }) { return <label className={`field ${className}`}><span>{label}</span>{children}</label>; }
function Detail({ hotel, onBack, onReserve }) { return <main className="detail content"><button className="back" onClick={onBack}>← Back to stays</button><div className="detail-hero"><img src={hotel.image} alt={hotel.name} /><div><p className="eyebrow">{hotel.city}</p><h1>{hotel.name}</h1><p>★ {hotel.rating} &nbsp;•&nbsp; {hotel.reviews} stays reviewed</p></div></div><div className="detail-columns"><div><p className="eyebrow dark">A PLACE TO LAND</p><h2>{hotel.description}</h2><p className="detail-copy">Come for the view, stay for the unhurried rhythm. Every jainStay room is prepared with the essentials done well and a little room left for surprise.</p><div className="amenities">◌ Breakfast &nbsp;&nbsp; ⌂ Free Wi-Fi &nbsp;&nbsp; ♧ Housekeeping</div></div><aside className="booking-box"><p className="eyebrow dark">YOUR STAY</p><div className="date-fields"><Field label="Check in"><input type="date" defaultValue={today} /></Field><Field label="Check out"><input type="date" /></Field></div><p className="room-label">Available rooms</p>{hotel.rooms.map((room) => <button className="room" key={room.id} onClick={() => onReserve(room)}><span><strong>{room.type}</strong><small>Up to {room.capacity} guests</small></span><b>{money(room.base_price)} <small>/ night</small></b></button>)}</aside></div><div className="gallery"><img src={hotel.image} alt="Hotel exterior" /><img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80" alt="Hotel room" /><img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80" alt="Hotel interior" /></div></main>; }
function Auth({ mode, onMode, onClose, onSubmit }) { return <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal"><button className="close" onClick={onClose}>×</button><p className="eyebrow dark">WELCOME TO JAINSTAY</p><h2>{mode === 'login' ? 'Good to see you.' : 'Start your stay story.'}</h2><p className="modal-copy">{mode === 'login' ? 'Sign in to manage your reservations and save places for later.' : 'Create an account to book your next thoughtful stay.'}</p><form onSubmit={onSubmit}>{mode === 'register' && <Field label="Your name"><input name="name" required placeholder="Aarav Sharma" /></Field>}<Field label="Email address"><input name="email" type="email" required placeholder="you@example.com" /></Field><Field label="Password"><input name="password" type="password" minLength="8" required placeholder="8 characters minimum" /></Field><button className="primary">{mode === 'login' ? 'Sign in' : 'Create account'} <span>→</span></button></form><button className="switch" onClick={() => onMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'New to jainStay? Create an account' : 'Already have an account? Sign in'}</button></div></div>; }
function Trips({ user, onHome, onSignOut }) { return <main className="trips content"><div className="trips-head"><div><p className="eyebrow dark">YOUR JAINSTAY</p><h1>Welcome, {user?.name?.split(' ')[0] || 'traveller'}.</h1></div><button className="outline" onClick={onSignOut}>Sign out</button></div><div className="empty"><div>✦</div><h2>Your next good day<br /><i>starts here.</i></h2><p>You have no upcoming stays yet. There are a few beautiful places waiting for you.</p><button className="primary" onClick={onHome}>Explore stays <span>→</span></button></div></main>; }
function Footer() { return <footer><div className="content footer-inner"><div><button className="wordmark footer-brand"><span>jain</span>Stay<i>.</i></button><p>Stay curious. Stay well.</p></div><div className="footer-links"><div><b>Explore</b><button>All stays</button><button>Destinations</button><button>Our story</button></div><div><b>Help</b><button>Contact us</button><button>Cancellation</button><button>Partner with us</button></div></div></div><div className="content footer-bottom"><span>© 2026 jainStay</span><span>Made for the journey</span></div></footer>; }
export default App;
