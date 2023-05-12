import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace, load }) {
  const [imageName, setImageName] = React.useState("");
  const [imageLink, setImageLink] = React.useState("");

  function handleChangeimageName(e) {
    setImageName(e.target.value);
  }

  function handleChangeimageLink(e) {
    setImageLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      imageName,
      imageLink,
    });

  }

  React.useEffect(() => {
    setImageName('');
    setImageLink('');
}, [isOpen]);



  return (
    <PopupWithForm
      title="Новое место"
      type="add"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      submit={load ? "Сохранение..." : "Создать"}
    >
      <input
        type="text"
        className="form__item form__item_type_title"
        name="title"
        id="add-title"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        required
        onChange={handleChangeimageName}
        value={imageName}
      />
      <span className="popup__error popup__error-add-title"> </span>{" "}
      <input
        type="url"
        className="form__item form__item_type_url"
        name="link"
        id="add-pic"
        placeholder="Ссылка на картинку"
        required
        onChange={handleChangeimageLink}
        value={imageLink}
      />
      <span className="popup__error popup__error-add-pic"> </span>{" "}
    </PopupWithForm>
  );
}

export default AddPlacePopup;
