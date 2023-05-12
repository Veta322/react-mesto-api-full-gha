import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Footer from "./Footer.js";
import Header from "./Header.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ok from "../images/ok.svg";
import error from "../images/error.svg";
import * as auth from "../utils/Auth";
import PopupWithSubmit from "./PopupWithSubmit.js";

function App() {
  const navigate = useNavigate();

  // ux/ui
  const [isLoading, setIisLoading] = useState(false);

  //user
  const [currentUser, setCurrentUser] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailName, setEmailName] = useState(null);

  //popup
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeleteSubmitOpen, setIsDeleteSubmitOpen] = React.useState(false);
  const [infoTooltip, setInfoTooltip] = useState(false);
  const [popupImage, setPopupImage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  //cards
  const [selectedCard, setSelectedCard] = React.useState({
    card: {},
    isOpen: false,
  });
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    const promises = [api.getInitialCards(), api.getPersonInfo()];

    Promise.all(promises)
      .then(([resCard, resUser]) => {
        setCurrentUser(resUser);
        setCards(resCard);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //лайк карточке
  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);

    if (!isLiked) {
      api
        .likeCard(card._id, !isLiked)
        .then((newCard) => {
          const newCards = cards.map((element) =>
            element._id === card._id ? newCard : element
          );
          setCards(newCards);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .removelikeCard(card._id, isLiked)
        .then((newCard) => {
          const newCards = cards.map((element) =>
            element._id === card._id ? newCard : element
          );
          setCards(newCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  //удаление карточки
  function handleCardDelete(card) {
    setIisLoading(true);
    api
      .delCard(card._id)
      .then(() => {
        setCards((arr) => arr.filter((item) => card._id !== item._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIisLoading(false));
  }
  //клик по карточке
  function handleCardClick(card) {
    setSelectedCard({
      card,
      isOpen: true,
    });
  }
  //обновление информации
  function handleUpdateUser(data) {
    setIisLoading(true);
    api
      .sendUserInfo({
        name: data.name,
        about: data.about,
      })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIisLoading(false));
  }
  //обновить аватар
  function handleUpdateAvatar(data) {
    setIisLoading(true);
    api
      .editAvatar({
        avatar: data.avatar,
      })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIisLoading(false));
  }
  //добавить фотокарточку
  function handleAddPlaceSubmit(data) {
    setIisLoading(true);
    api
      .addNewCard({
        name: data.imageName,
        link: data.imageLink,
      })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIisLoading(false));
  }
  //сменить аватар клик
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  //карандашик клик
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  //плюсик клик
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  //корзинка клик
  function handleDeleteCardClick(card) {
    setIsDeleteSubmitOpen(true);
    setSelectedCard({
      card,
      isOpen: false,
    });
  }
  //закрыть все попапы
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setInfoTooltip(false);
    setIsDeleteSubmitOpen(false);
    setSelectedCard({
      ...selectedCard,
      isOpen: false,
    });
  }
  //регистрация
  function onRegister(email, password) {
    setIisLoading(true);
    auth
      .register(email, password)
      .then(() => {
        setPopupImage(ok);
        setPopupTitle("Вы успешно зарегистрировались!");
        navigate("/sign-in");
      })
      .catch(() => {
        setPopupImage(error);
        setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
      })
      .finally(() => {
        setInfoTooltip(true);
        setIisLoading(false);
      });
  }
  //инфо баннер
  function handleInfoTooltip() {
    setInfoTooltip(true);
  }
  //залогиниться
  function onLogin(email, password) {
    setIisLoading(true);
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        setEmailName(email);
        navigate("/");
      })
      .catch(() => {
        setPopupImage(error);
        setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
        handleInfoTooltip();
      })
      .finally(() => {
        setIisLoading(false);
      });
  }
  //чек токена
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setEmailName(res.data.email);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);
  //навигация при регистрации
  useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  //выход
  function onSignOut() {
    setIsLoggedIn(false);
    setEmailName(null);
    navigate("/sign-in");
    localStorage.removeItem("jwt");
  }
  //разметка
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/sign-in"
            element={
              <>
                <Header title="Регистрация" route="/sign-up" />
                <Login onLogin={onLogin} load={isLoading} />{" "}
              </>
            }
          />

          <Route
            path="/sign-up"
            element={
              <>
                <Header title="Войти" route="/sign-in" />
                <Register onRegister={onRegister} load={isLoading} />{" "}
              </>
            }
          />

          <Route
            exact
            path="/"
            element={
              <>
                <Header
                  title="Выйти"
                  mail={emailName}
                  onClick={onSignOut}
                  route=""
                />
                <ProtectedRoute
                  component={Main}
                  isLogged={isLoggedIn}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteCardClick}
                />{" "}
                <Footer />
              </>
            }
          />

          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/sign-in"} />}
          />
        </Routes>{" "}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          load={isLoading}
        />{" "}
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          load={isLoading}
        />{" "}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          load={isLoading}
        />{" "}
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />{" "}
        <PopupWithSubmit
          isOpen={isDeleteSubmitOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
          card={selectedCard.card}
          load={isLoading}
        />
        <InfoTooltip
          image={popupImage}
          title={popupTitle}
          isOpen={infoTooltip}
          onCloseClick={closeAllPopups}
          onClose={closeAllPopups}
        />
      </div>{" "}
    </CurrentUserContext.Provider>
  );
}

export default App;
