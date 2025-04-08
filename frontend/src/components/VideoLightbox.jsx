import {useState} from "react";
import "./VideoLightbox.css";

const VideoLightbox = ({videoId}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={openModal} className="video-button">
        Watch Video
      </button>

      {isOpen && (
        <div className="lightbox-overlay" onClick={closeModal}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeModal}>
              ×
            </button>
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoLightbox;
