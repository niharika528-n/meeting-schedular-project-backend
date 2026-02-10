const express = require('express');
const MeetingInterface = require('./interface');

const router = express.Router();

router.post('/', MeetingInterface.create);
router.get('/', MeetingInterface.getAll);
router.get('/:id', MeetingInterface.getById);
router.put('/:id', MeetingInterface.update);
router.delete('/:id', MeetingInterface.delete);

module.exports = router;
