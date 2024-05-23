const router = require('express').Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    deleteThought,
    updateThought,
    addReaction,
    removeReaction,
} = require('../../controllers/thoughtsController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtsId').get(getSingleThought).delete(deleteThought).put(updateThought);

router.route('/:thoughtsId/reaction').post(addReaction);

router.route('/:thoughtsId/reaction/:reactionId').delete(removeReaction);

module.exports = router;