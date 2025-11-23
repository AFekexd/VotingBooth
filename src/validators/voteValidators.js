import { body, param } from 'express-validator';

export const createVoteValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 255 })
        .withMessage('Title must not exceed 255 characters'),

    body('description')
        .optional()
        .trim(),

    body('options')
        .isArray({ min: 2 })
        .withMessage('At least 2 options are required'),

    body('options.*.optionText')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Option text cannot be empty'),
];

export const updateVoteValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid vote ID'),

    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 255 })
        .withMessage('Title must not exceed 255 characters'),

    body('description')
        .optional()
        .trim(),

    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
];

export const voteIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid vote ID'),
];

export const castVoteValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid vote ID'),

    body('optionId')
        .isInt({ min: 1 })
        .withMessage('Valid option ID is required'),
];

// Add option validation
export const addOptionValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid vote ID'),

    body('optionText')
        .trim()
        .notEmpty()
        .withMessage('Option text is required')
        .isLength({ max: 255 })
        .withMessage('Option text must not exceed 255 characters'),
];

// Update option validation
export const updateOptionValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid vote ID'),

    param('optionId')
        .isInt({ min: 1 })
        .withMessage('Invalid option ID'),

    body('optionText')
        .trim()
        .notEmpty()
        .withMessage('Option text is required')
        .isLength({ max: 255 })
        .withMessage('Option text must not exceed 255 characters'),
];

// Option ID validation
export const optionIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid vote ID'),

    param('optionId')
        .isInt({ min: 1 })
        .withMessage('Invalid option ID'),
];

// Bulk operation validation
export const bulkOperationValidation = [
    body('voteIds')
        .isArray({ min: 1 })
        .withMessage('At least one vote ID is required'),

    body('voteIds.*')
        .isInt({ min: 1 })
        .withMessage('All vote IDs must be valid integers'),
];

