const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  like,
  unLike,
} = require('../controllers/cards');
const { validationCard, validationCardId  } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validationCard, createCard);
router.delete('/:cardId', validationCardId , deleteCard);
router.put('/likes/:cardId', validationCardId , like);
router.delete('/likes/:cardId', validationCardId , unLike);

module.exports = router;