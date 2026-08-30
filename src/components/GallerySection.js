import { siteContent } from '../Utils/constant';

export function GallerySection({ gallery, onRemoveGallery, isAdmin }) {
  return (
    <section id="gallery" className="container section-spacing">
      <div className="section-header">
        <p className="eyebrow">{siteContent.gallerySection.eyebrow}</p>
        <h2>{siteContent.gallerySection.title}</h2>
      </div>

      <div className="gallery-grid">
        {gallery.map((item) => (
          <div className="gallery-card" key={item.id}>
            <img src={item.image} alt={item.title} />
            <span>{item.title}</span>
            {isAdmin && onRemoveGallery && (
              <button type="button" className="danger-btn" onClick={() => onRemoveGallery(item.id)}>
                {siteContent.gallerySection.remove}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
