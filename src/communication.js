const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const API_ROOT = `${API_BASE_URL}/api`;

// Send an HTTP request to the backend and return its JSON response.
async function request(path, options = {}) {
  const token = localStorage.getItem('jainStayToken');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_ROOT}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }

  return body;
}

// Register a user account and return the authenticated session.
export function registerUser(payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

// Authenticate a user and return the authenticated session.
export function loginUser(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

// Fetch all publicly visible hotels.
export function getHotels() {
  return request('/hotels');
}

// Fetch one hotel with rooms and images.
export function getHotel(hotelId) {
  return request(`/hotels/${hotelId}`);
}

// Create a booking for the authenticated user.
export function createBooking(payload) {
  return request('/bookings', { method: 'POST', body: JSON.stringify(payload) });
}

// Add a review for a hotel as the authenticated user.
export function createReview(payload) {
  return request('/reviews', { method: 'POST', body: JSON.stringify(payload) });
}

// Create a room for an owned hotel.
export function createRoom(payload) {
  return request('/hotel/rooms', { method: 'POST', body: JSON.stringify(payload) });
}

// Update a room for an owned hotel.
export function updateRoom(roomId, payload) {
  return request(`/hotel/rooms/${roomId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

// Upload and save a hotel image.
export function uploadHotelImage(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
  return request('/hotel/images', { method: 'POST', body: formData });
}

// Update details for an owned hotel.
export function updateHotelDetails(payload) {
  return request('/hotel/details', { method: 'PUT', body: JSON.stringify(payload) });
}

// Create a hotel as an administrator.
export function createHotel(payload) {
  return request('/admin/hotels', { method: 'POST', body: JSON.stringify(payload) });
}

// Delete a hotel as an administrator.
export function deleteHotel(hotelId) {
  return request(`/admin/hotels/${hotelId}`, { method: 'DELETE' });
}

// Update a gallery image as an administrator.
export function updateGalleryImage(payload) {
  return request('/admin/gallery', { method: 'PUT', body: JSON.stringify(payload) });
}

export { API_BASE_URL };
