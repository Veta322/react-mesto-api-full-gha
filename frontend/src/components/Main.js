import React from "react";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";

import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="page__content">
      <section className="profile">
        <div className="profile__avatar" onClick={onEditAvatar}>
          <img
            className="profile__avatar-pic"
            src={currentUser.avatar}
            alt="туть должен быть аватар :("
          />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            className="button profile__edit"
            type="button"
            onClick={onEditProfile}
          >
            <img className="profile__edit-icon" src={pencil} alt="карандашик" />
          </button>
          <h2 className="profile__job">{currentUser.about}</h2>
        </div>

        <button
          className="button profile__add"
          type="button"
          onClick={onAddPlace}
        >
          <img className="profile__add-icon" src={plus} alt="плюсик" />
        </button>
      </section>
      <section className="elements">
        {cards.map((card) => (
          <Card
            card={card}
            onCardClick={onCardClick}
            key={card._id}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
