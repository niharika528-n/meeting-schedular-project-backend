const express = require('express');
const UserInterface = require('./interface');

const router = express.Router();

router.post('/', UserInterface.create);
router.get('/', UserInterface.getAll);
router.get('/:id', UserInterface.getById);
router.put('/:id', UserInterface.update);
router.delete('/:id', UserInterface.delete);

module.exports = router;
