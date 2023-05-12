import close from "../images/Close.svg";

function InfoTooltip(props) {
    return (
      <div className={`popup ${props.isOpen ? 'popup_open' : ''}`} onClick={props.onCloseClick}>
        <div className="popup__info popup__content">
        <button className="popup__close button" type="button" title="Закрыть" onClick={props.onClose}>
          <img className="popup__close-icon" src={close} alt="крестик" />
            </button>
            <div className="form">
          <img className="popup__status" src={props.image} alt={props.title}/>
          <h2 className="popup__message">{props.title}</h2>
        </div>
      </div>
      </div>
    );
  }
  
  export default InfoTooltip;