import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  defaultAdminCredentials,
  defaultGallery,
  defaultHotel,
  defaultReviews,
  defaultRooms,
} from './Utils/constant';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RoomSection } from './components/RoomSection';
import { BookingSection } from './components/BookingSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { AdminSection } from './components/AdminSection';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [hotel, setHotel] = useState(defaultHotel);
  const [hotelDraft, setHotelDraft] = useState(defaultHotel);

  const [rooms, setRooms] = useState(defaultRooms);
  const [gallery, setGallery] = useState(defaultGallery);
  const [reviews, setReviews] = useState(defaultReviews);

  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomType: 'Dormitory',
    checkIn: today,
    checkOut: '',
    payNow: false,
  });

  const [bookingStatus, setBookingStatus] = useState('');
  const [reviewForm, setReviewForm] = useState({ name: '', content: '' });
  const adminDefaults = defaultAdminCredentials ?? { username: 'admin@stay.com', password: 'stay123' };
  const [adminPanel, setAdminPanel] = useState({
    username: adminDefaults.username,
    password: adminDefaults.password,
    token: '',
    loggedIn: false,
  });
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    image: '',
  });

  const roomOptions = useMemo(
    () =>
      rooms.map((room, index) => ({
        ...room,
        image: gallery[index % Math.max(gallery.length, 1)]?.image || `${API_URL}/images/gallery-${(index % 4) + 1}.svg`,
      })),
    [rooms, gallery]
  );

  useEffect(() => {
    setHotelDraft(hotel);
  }, [hotel]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, roomsRes, galleryRes, reviewsRes] = await Promise.all([
          fetch(`${API_URL}/api/hotel`),
          fetch(`${API_URL}/api/rooms`),
          fetch(`${API_URL}/api/gallery`),
          fetch(`${API_URL}/api/reviews`),
        ]);

        if (hotelRes.ok) {
          const hotelData = await hotelRes.json();
          setHotel(hotelData);
        }

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData);
        }

        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGallery(galleryData);
        }

        if (reviewsRes.ok) {
          const reviewData = await reviewsRes.json();
          setReviews(reviewData);
        }
      } catch (error) {
        console.log('Using local demo data because the backend is not running yet.', error);
      }
    };

    fetchData();
  }, []);

  const validateBookingForm = () => {
    if (!bookingForm.guestName || !bookingForm.email || !bookingForm.phone || !bookingForm.checkIn || !bookingForm.checkOut) {
      return 'Please fill in all booking details.';
    }

    const checkInDate = new Date(bookingForm.checkIn);
    const checkOutDate = new Date(bookingForm.checkOut);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (checkInDate < todayDate || checkOutDate < todayDate) {
      return 'Past dates are not allowed for booking.';
    }

    if (checkOutDate <= checkInDate) {
      return 'Check-out date must be after check-in date.';
    }

    return '';
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateBookingForm();
    if (validationError) {
      setBookingStatus(validationError);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: bookingForm.guestName,
          email: bookingForm.email,
          phone: bookingForm.phone,
          roomType: bookingForm.roomType,
          checkIn: bookingForm.checkIn,
          checkOut: bookingForm.checkOut,
          payNow: bookingForm.payNow,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setBookingStatus(data.message || 'Booking failed.');
        return;
      }

      setBookingStatus(data.message || 'Booking successful.');
      setBookingForm((prev) => ({ ...prev, guestName: '', email: '', phone: '', checkOut: '' }));
    } catch (error) {
      setBookingStatus('Something went wrong while saving the booking.');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!reviewForm.content.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reviewForm.name || 'Guest', content: reviewForm.content }),
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();
      setReviews((prev) => [result, ...prev]);
      setReviewForm({ name: '', content: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdminLogin = async () => {
    const credentials = {
      username: adminPanel.username,
      password: adminPanel.password,
    };

    const isLocalAdmin =
      credentials.username === (defaultAdminCredentials?.username || 'admin@stay.com') &&
      credentials.password === (defaultAdminCredentials?.password || 'stay123');

    if (isLocalAdmin) {
      setAdminPanel((prev) => ({ ...prev, token: 'local-admin-token', loggedIn: true }));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      setAdminPanel((prev) => ({ ...prev, token: data.token, loggedIn: true }));
      fetchAdminData(data.token);
    } catch (error) {
      alert('Admin service is not available.');
    }
  };

  const fetchAdminData = async (token) => {
    try {
      const reviewRes = await fetch(`${API_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (reviewRes.ok) {
        const reviewsList = await reviewRes.json();
        setReviews(reviewsList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveHotelInfo = async () => {
    if (!adminPanel.token) return;

    const previousHotel = { ...hotel };
    setHotel(hotelDraft);

    try {
      const response = await fetch(`${API_URL}/api/admin/hotel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPanel.token}`,
        },
        body: JSON.stringify(hotelDraft),
      });

      if (!response.ok) {
        setHotel(previousHotel);
        setHotelDraft(previousHotel);
        return;
      }

      const updatedHotel = await response.json();
      setHotel(updatedHotel);
      setHotelDraft(updatedHotel);
    } catch (error) {
      console.error(error);
      setHotel(previousHotel);
      setHotelDraft(previousHotel);
    }
  };

  const updateRoomPrice = async (roomId, updates) => {
    if (!adminPanel.token) return;

    const optimisticRoom = {
      ...rooms.find((room) => room.id === roomId),
      ...updates,
    };

    setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room)));

    try {
      const response = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPanel.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        setRooms((prev) => prev.map((room) => (room.id === roomId ? optimisticRoom : room)));
        return;
      }

      const updatedRoom = await response.json();
      setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, ...updatedRoom } : room)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleGalleryFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setGalleryForm((prev) => ({ ...prev, image: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setGalleryForm((prev) => ({ ...prev, image: String(reader.result || '') }));
    };
    reader.onerror = () => {
      alert('The selected image could not be read. Please choose another file.');
    };
    reader.readAsDataURL(file);
  };

  const addGalleryItem = async () => {
    const finalTitle = galleryForm.title.trim();
    const finalImage = galleryForm.image || '';

    if (!adminPanel.loggedIn && !adminPanel.token) {
      alert('Please log in as admin before uploading an image.');
      return;
    }

    if (!finalTitle) {
      alert('Please enter an image title.');
      return;
    }

    if (!finalImage || !finalImage.startsWith('data:image/')) {
      alert('Please choose an image file before uploading.');
      return;
    }

    const localItem = {
      id: Date.now(),
      title: finalTitle,
      image: finalImage,
    };

    setGallery((prev) => [localItem, ...prev]);
    setGalleryForm({ title: '', image: '' });

    try {
      const response = await fetch(`${API_URL}/api/admin/gallery/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPanel.token || 'local-admin-token'}`,
        },
        body: JSON.stringify({ title: finalTitle, image: finalImage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Image upload failed.');
        setGallery((prev) => prev.filter((item) => item.id !== localItem.id));
        return;
      }

      const item = await response.json();
      setGallery((prev) => [item, ...prev.filter((entry) => entry.id !== localItem.id)]);
    } catch (error) {
      console.error(error);
      alert('Image upload failed. Please make sure the backend server is running.');
      setGallery((prev) => prev.filter((item) => item.id !== localItem.id));
    }
  };

  const removeGalleryItem = (itemId) => {
    setGallery((prev) => prev.filter((item) => item.id !== itemId));
  };

  const toggleReviewFlag = async (reviewId, flagged) => {
    if (!adminPanel.token) return;

    const previousReviews = [...reviews];
    setReviews((prev) => prev.map((review) => (review.id === reviewId ? { ...review, flagged } : review)));

    try {
      const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}/flag`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPanel.token}`,
        },
        body: JSON.stringify({ flagged }),
      });

      if (!response.ok) {
        setReviews(previousReviews);
        return;
      }

      const updatedReview = await response.json();
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? { ...review, ...updatedReview } : review)));
    } catch (error) {
      console.error(error);
      setReviews(previousReviews);
    }
  };

  const replyToReview = async (reviewId, reply) => {
    if (!adminPanel.token) return;

    const previousReviews = [...reviews];
    setReviews((prev) => prev.map((review) => (review.id === reviewId ? { ...review, admin_reply: reply } : review)));

    try {
      const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPanel.token}`,
        },
        body: JSON.stringify({ reply }),
      });

      if (!response.ok) {
        setReviews(previousReviews);
        return;
      }

      const updatedReview = await response.json();
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? { ...review, admin_reply: updatedReview.admin_reply } : review)));
    } catch (error) {
      console.error(error);
      setReviews(previousReviews);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!adminPanel.token) return;

    const reviewToDelete = reviews.find((review) => review.id === reviewId);
    if (reviewToDelete?.flagged) {
      alert('Flagged reviews cannot be deleted.');
      return;
    }

    const previousReviews = [...reviews];
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));

    try {
      const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminPanel.token}` },
      });

      if (!response.ok) {
        setReviews(previousReviews);
        alert('Flagged reviews cannot be deleted.');
        return;
      }
    } catch (error) {
      console.error(error);
      setReviews(previousReviews);
    }
  };

  const handleAdminNavClick = () => {
    if (adminPanel.loggedIn) {
      setAdminPanel((prev) => ({ ...prev, token: '', loggedIn: false }));
      return;
    }

    const adminSection = document.getElementById('admin-panel-section');
    if (adminSection) {
      adminSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="hotel-app">
      <Header hotel={hotel} adminPanel={adminPanel} onLoginClick={handleAdminNavClick} />
      <main>
        <HeroSection hotel={hotel} />
        <RoomSection roomOptions={roomOptions} />
        <BookingSection
          rooms={rooms}
          today={today}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          bookingStatus={bookingStatus}
          onSubmit={handleBookingSubmit}
        />
        <GallerySection gallery={gallery} onRemoveGallery={removeGalleryItem} isAdmin={adminPanel.loggedIn} />
        <ReviewsSection
          reviews={reviews}
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          onSubmit={handleReviewSubmit}
          adminPanel={adminPanel}
        />
        <ContactSection hotel={hotel} />
        <AdminSection
          hotel={hotelDraft}
          setHotel={setHotelDraft}
          adminPanel={adminPanel}
          rooms={rooms}
          reviews={reviews}
          galleryForm={galleryForm}
          setGalleryForm={setGalleryForm}
          onLogin={handleAdminLogin}
          setAdminPanel={setAdminPanel}
          onHotelSave={saveHotelInfo}
          onRoomPriceChange={(roomId, updates) =>
            setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room)))
          }
          onRoomUpdate={updateRoomPrice}
          onGallerySubmit={addGalleryItem}
          onGalleryFileSelect={handleGalleryFileSelect}
          onReviewFlagToggle={toggleReviewFlag}
          onReviewReply={replyToReview}
          onReviewDelete={deleteReview}
        />
      </main>
    </div>
  );
}

export default App;
