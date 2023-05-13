const Card = require('../models/card');

const BadRequest = require('../utils/errors/BadRequest');
const Forbidden = require('../utils/errors/Forbidden');
const NotFound = require('../utils/errors/NotFound');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => {
      return card
        .populate('owner')
        .then((createdCard) => { res.status(201).send(createdCard) })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Упс :( Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFound('Карточка с данным _id не найдена :(');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Нельзя удалить чужие карточки :(');
      }
      return card.deleteOne().then(() => res.status(200).send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.like = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFound('Карточка с данным _id не найдена:(');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка:('));
      } else {
        next(err);
      }
    });
};

module.exports.unLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFound('Карточка с данным _id не найдена:(');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка :('));
      } else {
        next(err);
      }
    });
};
