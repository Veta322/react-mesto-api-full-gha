import React from "react";
import close from "../images/Close.svg";

function ImagePopup(props) {
  React.useEffect(() => {
    if (!props.card.isOpen) return;
    const escClose = (event) => {
      if (event.key === "Escape") {
        props.onClose(); 
      }
    };
    document.addEventListener("keydown", escClose);
    return () => {
      document.removeEventListener("keydown", escClose);
    };
  }, [props, props.card.isOpen, props.onClose]);

  const overlayClose = (event) => {
    if (event.target === event.currentTarget && props.card.isOpen) {
      props.onClose();
    }
  }
  return (
    <section
      className={
        props.card.isOpen ? `popup popup_open popup-image` : `popup popup-image`
      }
    >
      <div
        className="popup__content popup__content_image"
        onMouseDown={overlayClose}
      >
        <button
          className="button popup__close close-image"
          type="button"
          onClick={props.onClose}
        >
          <img className="popup__close-icon" src={close} alt="крестик" />
        </button>
        <div className="open-content">
          <img
            className="open-content__image"
            src={props.card.card.link}
            alt={props.card.card.name}
          />
          <h2 className="open-content__title">{props.card.card.name}</h2>
        </div>
      </div>
    </section>
  );
}

export default ImagePopup;
