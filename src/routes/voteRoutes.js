import express from 'express';
import {
    getAllVotes,
    getVoteById,
    createVote,
    updateVote,
    deleteVote,
    getVoteResults,
    castVote,
    getStatistics,
    getPopularVotes,
    getActiveVotes,
    getClosedVotes,
    searchVotes,
    closeVote,
    bulkCloseVotes,
    bulkActivateVotes,
    addOption,
    updateOption,
    removeOption
} from '../controllers/voteController.js';
import {
    createVoteValidation,
    updateVoteValidation,
    voteIdValidation,
    castVoteValidation,
    addOptionValidation,
    updateOptionValidation,
    optionIdValidation,
    bulkOperationValidation
} from '../validators/voteValidators.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Statistics routes (must come before /:id routes)
router.get('/stats/overview', getStatistics);
router.get('/stats/popular', getPopularVotes);

// Filtering and search routes
router.get('/active', getActiveVotes);
router.get('/closed', getClosedVotes);
router.get('/search', searchVotes);

// Bulk operations
router.put('/bulk/close', bulkOperationValidation, validate, bulkCloseVotes);
router.put('/bulk/activate', bulkOperationValidation, validate, bulkActivateVotes);

// Vote CRUD routes
router.get('/', getAllVotes);
router.get('/:id', voteIdValidation, validate, getVoteById);
router.post('/', createVoteValidation, validate, createVote);
router.put('/:id', updateVoteValidation, validate, updateVote);
router.delete('/:id', voteIdValidation, validate, deleteVote);

// Voting routes
router.get('/:id/results', voteIdValidation, validate, getVoteResults);
router.post('/:id/cast', castVoteValidation, validate, castVote);
router.put('/:id/close', voteIdValidation, validate, closeVote);

// Option management routes
router.post('/:id/options', addOptionValidation, validate, addOption);
router.put('/:id/options/:optionId', updateOptionValidation, validate, updateOption);
router.delete('/:id/options/:optionId', optionIdValidation, validate, removeOption);

export default router;

