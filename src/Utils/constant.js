// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const defaultHotel = {
  name: '',
  tagline: '',
  description: '',
  amenities: [],
  contact: {
    phone: '',
    email: '',
    address: '',
  },
};

export const defaultRooms = [];

export const defaultGallery = [];

export const defaultReviews = [];

export const defaultAdminCredentials = {
  username: 'admin@stay.com',
  password: 'stay123',
};

export const siteContent = {
  nav: {
    rooms: 'Rooms',
    gallery: 'Gallery',
    reviews: 'Reviews',
    contact: 'Contact',
  },
  hero: {
    eyebrow: 'Welcome to Shikharji Stay',
    bookNow: 'Book now',
    viewGallery: 'View gallery',
    quickStay: 'Quick Stay Info',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    location: 'Location',
    city: 'Rishikesh',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
  },
  roomSection: {
    eyebrow: 'Room options',
    title: 'Choose your perfect stay',
    left: 'left',
    perNight: '/night',
    descriptions: {
      Dormitory: 'Shared, budget-friendly space for travelers.',
      AC: 'Premium room with air conditioning and restful interiors.',
      'Non-AC': 'Comfortable room with cosy ambiance and calm interiors.',
    },
  },
  booking: {
    eyebrow: 'Bookings',
    title: 'Reserve your room',
    guestName: 'Guest name',
    phone: 'Phone',
    email: 'Email',
    roomType: 'Room type',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    payNowLabel: 'Pay immediately for confirmed booking',
    confirmBooking: 'Confirm booking',
    summaryTitle: 'Stay summary',
    selectedRoom: 'Selected room',
    price: 'Price',
    paidNow: 'Paid now',
    yes: 'Yes',
    no: 'No',
  },
  gallerySection: {
    eyebrow: 'Gallery',
    title: 'Explore the property',
    remove: 'Remove',
  },
  reviewsSection: {
    eyebrow: 'Customer reviews',
    title: 'What guests say',
    name: 'Name',
    review: 'Review',
    submit: 'Submit review',
    guest: 'Guest',
    flagged: 'Flagged',
    admin: 'Admin',
  },
  contactSection: {
    eyebrow: 'Contact',
    title: 'Plan your next stay',
    reserveByPhone: 'Reserve by phone',
    reserveByPhoneText: 'Call our team to confirm custom room requests and group bookings.',
    callNow: 'Call now',
  },
  admin: {
    eyebrow: 'Admin dashboard',
    title: 'Manage hotel data',
    username: 'Username',
    password: 'Password',
    login: 'Admin login',
    updateRoomPrice: 'Update room price',
    addGallery: 'Add gallery',
    imageTitle: 'Image title',
    addImage: 'Add image',
    reviewModeration: 'Review moderation',
    flag: 'Flag',
    unflag: 'Unflag',
    reply: 'Reply',
    delete: 'Delete',
    flaggedReviewsCannotBeDeleted: 'Flagged reviews cannot be deleted.',
  },
};
