import { useState } from 'react';
import { createOwnedHotel, createRoom, updateHotelDetails, updateRoom } from './communication';
import ImageUploader from './ImageUploader';

const emptyRoom = { type: '', basePrice: '', capacity: '2' };

// Create a new property or edit an existing property in one reusable page.
export default function AddProperty({ user, existingProperty, onBack, onSaved, onNotice }) {
  const [property, setProperty] = useState({ name: existingProperty?.name || '', address: existingProperty?.address || '', description: existingProperty?.description || '' });
  const [hotel, setHotel] = useState(existingProperty || null);
  const [room, setRoom] = useState(emptyRoom);
  const [rooms, setRooms] = useState(existingProperty?.rooms || []);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [busy, setBusy] = useState(false);

  // Update a property field from the unified details form.
  function updateProperty(event) {
    setProperty({ ...property, [event.target.name]: event.target.value });
  }

  // Create the property or save changes to the existing owner property.
  async function submitProperty(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const saved = hotel ? await updateHotelDetails({ hotelId: hotel.id, ...property }) : await createOwnedHotel(property);
      setHotel({ ...hotel, ...saved });
      onSaved?.({ ...hotel, ...saved });
      onNotice(hotel ? 'Property details updated.' : 'Property created. Add rooms and images below.');
    } catch (error) {
      onNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  // Add a room to the property currently being edited.
  async function submitRoom(event) {
    event.preventDefault();
    if (!hotel) return;
    setBusy(true);
    try {
      const created = await createRoom({ hotelId: hotel.id, ...room, basePrice: Number(room.basePrice), capacity: Number(room.capacity) });
      setRooms([...rooms, created]);
      setRoom(emptyRoom);
    } catch (error) {
      onNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  // Save an existing room's type, nightly price, and guest capacity.
  async function saveRoom(item) {
    setBusy(true);
    try {
      const updated = await updateRoom(item.id, {
        type: item.type,
        basePrice: Number(item.base_price),
        capacity: Number(item.capacity),
      });
      setRooms(rooms.map((roomItem) => roomItem.id === updated.id ? updated : roomItem));
      onNotice('Room details updated.');
    } catch (error) {
      onNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  // Update one field in an existing room row before saving it.
  function updateExistingRoom(roomId, field, value) {
    setRooms(rooms.map((item) => item.id === roomId ? { ...item, [field]: value } : item));
  }

  if (user?.role !== 'hotel') {
    return <main className="property-page content"><button className="back" onClick={onBack}>← Back to stays</button><section className="property-card access-card"><p className="eyebrow dark">PROPERTY PARTNER</p><h2>Hotel-owner access required.</h2><p>Sign in with a hotel-owner account to create and manage properties.</p></section></main>;
  }

  return <main className="property-page content">
    <button className="back" onClick={onBack}>← Back to properties</button>
    <div className="property-heading"><div><p className="eyebrow dark">PROPERTY PARTNER</p><h1>{existingProperty ? <>Refine your<br /><i>place.</i></> : <>Bring your place<br /><i>to life.</i></>}</h1></div><p>Manage your property details, rooms, and images from one place.</p></div>
    <form className="property-card" onSubmit={submitProperty}><p className="eyebrow dark">01 / PROPERTY DETAILS</p><h2>{existingProperty ? 'Edit your stay.' : 'Tell us about the stay.'}</h2><label>Property name<input name="name" value={property.name} onChange={updateProperty} required placeholder="The Fern House" /></label><label>Address<input name="address" value={property.address} onChange={updateProperty} required placeholder="Street, city, state" /></label><label>Description<textarea name="description" value={property.description} onChange={updateProperty} rows="5" placeholder="What should guests know about this place?" /></label><button className="primary" type="submit" disabled={busy}>{busy ? 'Saving...' : existingProperty ? 'Save details' : 'Create property'} <span>→</span></button></form>
    {hotel && <div className="property-steps"><section className="property-card"><div className="step-title"><div><p className="eyebrow dark">PROPERTY</p><h2>{hotel.name}</h2><p>{hotel.address}</p></div><span className="complete">✓ Ready</span></div></section><section className="property-card"><p className="eyebrow dark">02 / ROOMS</p><h2>Give guests a good night.</h2><form onSubmit={submitRoom} className="room-form"><label>Room type<input value={room.type} onChange={(event) => setRoom({ ...room, type: event.target.value })} required placeholder="Garden King" /></label><label>Price / night<input type="number" min="0" value={room.basePrice} onChange={(event) => setRoom({ ...room, basePrice: event.target.value })} required placeholder="4200" /></label><label>Capacity<input type="number" min="1" value={room.capacity} onChange={(event) => setRoom({ ...room, capacity: event.target.value })} required /></label><button className="primary" disabled={busy}>Add room <span>→</span></button></form>{rooms.length > 0 && <div className="saved-rooms">{rooms.map((item) => <div className="saved-room" key={item.id}><input value={item.type} onChange={(event) => updateExistingRoom(item.id, 'type', event.target.value)} aria-label="Room type" /><input type="number" min="0" value={item.base_price} onChange={(event) => updateExistingRoom(item.id, 'base_price', event.target.value)} aria-label="Room price" /><input type="number" min="1" value={item.capacity} onChange={(event) => updateExistingRoom(item.id, 'capacity', event.target.value)} aria-label="Room capacity" /><button className="text-button" type="button" onClick={() => saveRoom(item)} disabled={busy}>Save</button></div>)}</div>}</section><section className="property-card"><p className="eyebrow dark">03 / IMAGES</p><h2>Show them the feeling.</h2><div className="upload-columns"><div><h3>Gallery</h3><ImageUploader hotelId={hotel.id} type="gallery" onUploaded={() => onNotice('Gallery image uploaded.')} /></div><div><h3>Room images</h3>{rooms.length > 0 ? <><select className="room-image-select" value={selectedRoomId} onChange={(event) => setSelectedRoomId(event.target.value)}><option value="">Choose a room</option>{rooms.map((item) => <option key={item.id} value={item.id}>{item.type}</option>)}</select><ImageUploader hotelId={hotel.id} roomId={selectedRoomId} type="room" onUploaded={() => onNotice('Room image uploaded.')} /></> : <p className="upload-status">Add a room first to upload room images.</p>}</div></div></section></div>}
  </main>;
}
