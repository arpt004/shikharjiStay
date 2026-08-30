import { siteContent } from '../Utils/constant';
import { formatCurrency } from '../Utils/utils';

export function RoomSection({ roomOptions }) {
  return (
    <section id="rooms" className="container section-spacing">
      <div className="section-header">
        <p className="eyebrow">{siteContent.roomSection.eyebrow}</p>
        <h2>{siteContent.roomSection.title}</h2>
      </div>

      <div className="rooms-grid">
        {roomOptions.map((room) => (
          <article className="room-card" key={room.id}>
            <img src={room.image} alt={room.type} />
            <div className="room-body">
              <div className="room-header-row">
                <h3>{room.type}</h3>
                <span>
                  {room.availability} {siteContent.roomSection.left}
                </span>
              </div>
              <p>{siteContent.roomSection.descriptions[room.type] || siteContent.roomSection.descriptions['Non-AC']}</p>
              <div className="price-row">
                <strong>{formatCurrency(room.price)}</strong>
                <span>{siteContent.roomSection.perNight}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
