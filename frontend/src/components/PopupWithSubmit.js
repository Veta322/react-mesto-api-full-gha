import PopupWithForm from "./PopupWithForm";

function PopupWithSubmit({ isOpen, onClose, onSubmit, card, load }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(card);
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      type="delete"
      form="delete"
      title="Вы уверены?"
      submit={load ? "Удаление..." : "Да"}
    />
  );
}

export default PopupWithSubmit;