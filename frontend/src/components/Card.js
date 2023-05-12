import React from "react";
import trash from "../images/trash.svg";
import heart from "../images/heart.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = props.card.owner._id === currentUser._id;

  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `element__like ${
    isLiked ? "element__like-active" : ""
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <div className="element">
      {!isOwn ? null : (
        <button className="button element__delete" type="button">
          <img
            className="element__delete-icon"
            src={trash}
            alt="мусорка"
            onClick={handleDeleteClick}
          />
        </button>
      )}

      <img
        className="element__image"
        src={props.card.link}
        onClick={handleClick}
        alt={props.card.name}
      />
      <div className="element__description">
        <h2 className="element__title">{props.card.name}</h2>
        <div>
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="button"
          >
            <img className="element__like-icon" src={heart} alt="сердечко" />
          </button>
          <div className="element__counter">{props.card.likes.length}</div>
        </div>
      </div>
    </div>
  );
}

export default Card;
