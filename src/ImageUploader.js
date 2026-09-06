import { useEffect, useState } from 'react';
import { uploadHotelImage } from './communication';

// Upload a gallery or room image and show it immediately after the backend saves it.
export default function ImageUploader({ hotelId, roomId, type, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  // Keep a local preview so the owner can inspect the selected image before upload.
  function chooseFile(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setStatus('');
  }

  // Send the original file and its image category to the API.
  async function upload(event) {
    event.preventDefault();
    if (!file) return setStatus('Choose an image first.');
    if (type === 'room' && !roomId) return setStatus('Add a room before uploading room images.');
    setStatus('Uploading...');
    try {
      const image = await uploadHotelImage({ hotelId, roomId, type, image: file });
      onUploaded(image);
      setFile(null);
      setPreview('');
      event.currentTarget.reset();
      setStatus('Uploaded');
    } catch (error) {
      setStatus(error.message);
    }
  }

  return <form className="image-uploader" onSubmit={upload}>
    <label className="upload-dropzone">
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={chooseFile} />
      {preview ? <img src={preview} alt="Selected property preview" /> : <span>Choose a JPG, PNG, WEBP, or GIF</span>}
    </label>
    <button className="primary" type="submit" disabled={!hotelId || !file}>{type === 'room' ? 'Upload room image' : 'Upload gallery image'} <span>→</span></button>
    {status && <small className="upload-status">{status}</small>}
  </form>;
}