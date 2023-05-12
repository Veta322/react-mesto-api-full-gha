import React from "react";
import close from "../images/Close.svg";

function PopupWithForm(props) {
  React.useEffect(() => {
    if (!props.isOpen) return;
    const escClose = (event) => {
      if (event.key === "Escape") {
        props.onClose();
      }
    };
    document.addEventListener("keydown", escClose);
    return () => {
      document.removeEventListener("keydown", escClose);
    };
  }, [props, props.isOpen, props.onClose]);

  const overlayClose = (event) => {
    if (event.target === event.currentTarget && props.isOpen) {
      props.onClose();
    }
  };

  return (
    <section
      className={
        props.isOpen
          ? `popup popup_open popup-${props.type}`
          : `popup popup-${props.type}`
      }
    >
      <div className="popup__content" onMouseDown={overlayClose}>
        <button
          className={`button popup__close close-${props.type}`}
          type="button"
          onClick={props.onClose}
        >
          <img className="popup__close-icon" src={close} alt="крестик" />
        </button>{" "}
        <form
          className={`form form-${props.type}`}
          name={`${props.type}-info`}
          onSubmit={props.onSubmit}
        >
          <h2 className="form__heading"> {props.title} </h2>{" "}
          <fieldset className="form__input-container">
            {" "}
            {props.children}{" "}
          </fieldset>{" "}
          <button type="submit" className="button popup__save">
            {" "}
            {props.submit}{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </section>
  );
}

export default PopupWithForm;
