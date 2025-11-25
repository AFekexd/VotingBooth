import prisma from '../config/database.js';
import AppError from '../utils/AppError.js';

// Get all votes
export const getAllVotes = async (req, res, next) => {
    try {
        const votes = await prisma.vote.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: votes.length,
            data: votes
        });
    } catch (error) {
        next(error);
    }
};

// Get single vote by ID
export const getVoteById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const vote = await prisma.vote.findUnique({
            where: { id: parseInt(id) },
            include: {
                options: true
            }
        });

        if (!vote) {
            return next(new AppError('Vote not found', 404));
        }

        res.status(200).json({
            success: true,
            data: vote
        });
    } catch (error) {
        next(error);
    }
};

// Create new vote
export const createVote = async (req, res, next) => {
    try {
        const { title, description, options } = req.body;

        // Create vote with options
        const vote = await prisma.vote.create({
            data: {
                title,
                description,
                options: {
                    create: options.map(opt => ({
                        optionText: opt.optionText || opt
                    }))
                }
            },
            include: {
                options: true
            }
        });

        res.status(201).json({
            success: true,
            data: vote
        });
    } catch (error) {
        next(error);
    }
};

// Update vote
export const updateVote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, isActive } = req.body;

        // Check if vote exists
        const existingVote = await prisma.vote.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingVote) {
            return next(new AppError('Vote not found', 404));
        }

        // Update vote
        const vote = await prisma.vote.update({
            where: { id: parseInt(id) },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(isActive !== undefined && { isActive })
            },
            include: {
                options: true
            }
        });

        res.status(200).json({
            success: true,
            data: vote
        });
    } catch (error) {
        next(error);
    }
};

// Delete vote
export const deleteVote = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if vote exists
        const existingVote = await prisma.vote.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingVote) {
            return next(new AppError('Vote not found', 404));
        }

        // Delete vote (options will be cascade deleted)
        await prisma.vote.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            success: true,
            message: 'Vote deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get vote results
export const getVoteResults = async (req, res, next) => {
    try {
        const { id } = req.params;

        const vote = await prisma.vote.findUnique({
            where: { id: parseInt(id) },
            include: {
                options: {
                    orderBy: {
                        voteCount: 'desc'
                    }
                }
            }
        });

        if (!vote) {
            return next(new AppError('Vote not found', 404));
        }

        // Calculate total votes
        const totalVotes = vote.options.reduce((sum, opt) => sum + opt.voteCount, 0);

        // Add percentage to each option
        const resultsWithPercentage = vote.options.map(opt => ({
            ...opt,
            percentage: totalVotes > 0 ? ((opt.voteCount / totalVotes) * 100).toFixed(2) : 0
        }));

        res.status(200).json({
            success: true,
            data: {
                ...vote,
                totalVotes,
                options: resultsWithPercentage
            }
        });
    } catch (error) {
        next(error);
    }
};

// Cast a vote
export const castVote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { optionId } = req.body;

        // Check if vote exists and is active
        const vote = await prisma.vote.findUnique({
            where: { id: parseInt(id) },
            include: {
                options: true
            }
        });

        if (!vote) {
            return next(new AppError('Vote not found', 404));
        }

        if (!vote.isActive) {
            return next(new AppError('This vote is closed', 400));
        }

        // Check if option exists and belongs to this vote
        const option = vote.options.find(opt => opt.id === parseInt(optionId));

        if (!option) {
            return next(new AppError('Invalid option for this vote', 400));
        }

        // Increment vote count
        const updatedOption = await prisma.option.update({
            where: { id: parseInt(optionId) },
            data: {
                voteCount: {
                    increment: 1
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Vote cast successfully',
            data: updatedOption
        });
    } catch (error) {
        next(error);
    }
};

// Get overall statistics
export const getStatistics = async (req, res, next) => {
    try {
        const [totalVotes, activeVotes, closedVotes, allVotes] = await Promise.all([
            prisma.vote.count(),
            prisma.vote.count({ where: { isActive: true } }),
            prisma.vote.count({ where: { isActive: false } }),
            prisma.vote.findMany({
                include: {
                    options: true
                }
            })
        ]);

        // Calculate total participants across all votes
        const totalParticipants = allVotes.reduce((sum, vote) => {
            const voteTotal = vote.options.reduce((optSum, opt) => optSum + opt.voteCount, 0);
            return sum + voteTotal;
        }, 0);

        // Find most popular vote
        let mostPopularVote = null;
        let maxVotes = 0;

        allVotes.forEach(vote => {
            const voteTotal = vote.options.reduce((sum, opt) => sum + opt.voteCount, 0);
            if (voteTotal > maxVotes) {
                maxVotes = voteTotal;
                mostPopularVote = {
                    id: vote.id,
                    title: vote.title,
                    totalVotes: voteTotal
                };
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalVotes,
                activeVotes,
                closedVotes,
                totalParticipants,
                mostPopularVote
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get popular votes
export const getPopularVotes = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const votes = await prisma.vote.findMany({
            include: {
                options: true
            }
        });

        // Calculate total votes for each and sort
        const votesWithTotals = votes.map(vote => {
            const totalVotes = vote.options.reduce((sum, opt) => sum + opt.voteCount, 0);
            return {
                ...vote,
                totalVotes
            };
        }).sort((a, b) => b.totalVotes - a.totalVotes).slice(0, limit);

        res.status(200).json({
            success: true,
            count: votesWithTotals.length,
            data: votesWithTotals
        });
    } catch (error) {
        next(error);
    }
};

// Get active votes with pagination
export const getActiveVotes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [votes, total] = await Promise.all([
            prisma.vote.findMany({
                where: { isActive: true },
                include: {
                    options: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.vote.count({ where: { isActive: true } })
        ]);

        res.status(200).json({
            success: true,
            count: votes.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: votes
        });
    } catch (error) {
        next(error);
    }
};

// Get closed votes with pagination
export const getClosedVotes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [votes, total] = await Promise.all([
            prisma.vote.findMany({
                where: { isActive: false },
                include: {
                    options: true
                },
                orderBy: {
                    closedAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.vote.count({ where: { isActive: false } })
        ]);

        res.status(200).json({
            success: true,
            count: votes.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: votes
        });
    } catch (error) {
        next(error);
    }
};

// Search votes
export const searchVotes = async (req, res, next) => {
    try {
        const query = req.query.q || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!query.trim()) {
            return next(new AppError('Search query is required', 400));
        }

        const [votes, total] = await Promise.all([
            prisma.vote.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: query
                            }
                        },
                        {
                            description: {
                                contains: query
                            }
                        }
                    ]
                },
                include: {
                    options: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.vote.count({
                where: {
                    OR: [
                        {
                            title: {
                                contains: query
                            }
                        },
                        {
                            description: {
                                contains: query
                            }
                        }
                    ]
                }
            })
        ]);

        res.status(200).json({
            success: true,
            query,
            count: votes.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: votes
        });
    } catch (error) {
        next(error);
    }
};

// Close a vote
export const closeVote = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingVote = await prisma.vote.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingVote) {
            return next(new AppError('Vote not found', 404));
        }

        if (!existingVote.isActive) {
            return next(new AppError('Vote is already closed', 400));
        }

        const vote = await prisma.vote.update({
            where: { id: parseInt(id) },
            data: {
                isActive: false,
                closedAt: new Date()
            },
            include: {
                options: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Vote closed successfully',
            data: vote
        });
    } catch (error) {
        next(error);
    }
};

// Bulk close votes
export const bulkCloseVotes = async (req, res, next) => {
    try {
        const { voteIds } = req.body;

        const result = await prisma.vote.updateMany({
            where: {
                id: {
                    in: voteIds.map(id => parseInt(id))
                },
                isActive: true
            },
            data: {
                isActive: false,
                closedAt: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: `${result.count} vote(s) closed successfully`,
            count: result.count
        });
    } catch (error) {
        next(error);
    }
};

// Bulk activate votes
export const bulkActivateVotes = async (req, res, next) => {
    try {
        const { voteIds } = req.body;

        const result = await prisma.vote.updateMany({
            where: {
                id: {
                    in: voteIds.map(id => parseInt(id))
                },
                isActive: false
            },
            data: {
                isActive: true,
                closedAt: null
            }
        });

        res.status(200).json({
            success: true,
            message: `${result.count} vote(s) activated successfully`,
            count: result.count
        });
    } catch (error) {
        next(error);
    }
};

// Add option to existing vote
export const addOption = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { optionText } = req.body;

        // Check if vote exists
        const vote = await prisma.vote.findUnique({
            where: { id: parseInt(id) }
        });

        if (!vote) {
            return next(new AppError('Vote not found', 404));
        }

        // Create new option
        const option = await prisma.option.create({
            data: {
                voteId: parseInt(id),
                optionText
            }
        });

        res.status(201).json({
            success: true,
            message: 'Option added successfully',
            data: option
        });
    } catch (error) {
        next(error);
    }
};

// Update option
export const updateOption = async (req, res, next) => {
    try {
        const { id, optionId } = req.params;
        const { optionText } = req.body;

        // Check if vote exists
        const vote = await prisma.vote.findUnique({
            where: { id: parseInt(id) },
            include: {
                options: true
            }
        });

        if (!vote) {
            return next(new AppError('Vote not found', 404));
        }

        // Check if option belongs to this vote
        const optionExists = vote.options.find(opt => opt.id === parseInt(optionId));

        if (!optionExists) {
            return next(new AppError('Option not found for this vote', 404));
        }

        // Update option
        const option = await prisma.option.update({
            where: { id: parseInt(optionId) },
            data: {
                optionText
            }
        });

        res.status(200).json({
            success: true,
            message: 'Option updated successfully',
            data: option
        });
    } catch (error) {
        next(error);
    }
};

// Remove option
export const removeOption = async (req, res, next) => {
    try {
        const { id, optionId } = req.params;

        // Check if vote exists
        const vote = await prisma.vote.findUnique({
            where: { id: parseInt(id) },
            include: {
                options: true
            }
        });

        if (!vote) {
            return next(new AppError('Vote not found', 404));
        }

        // Check if option belongs to this vote
        const option = vote.options.find(opt => opt.id === parseInt(optionId));

        if (!option) {
            return next(new AppError('Option not found for this vote', 404));
        }

        // Check if option has votes
        if (option.voteCount > 0) {
            return next(new AppError('Cannot delete option with existing votes', 400));
        }

        // Check if vote would have less than 2 options after deletion
        if (vote.options.length <= 2) {
            return next(new AppError('Vote must have at least 2 options', 400));
        }

        // Delete option
        await prisma.option.delete({
            where: { id: parseInt(optionId) }
        });

        res.status(200).json({
            success: true,
            message: 'Option removed successfully'
        });
    } catch (error) {
        next(error);
    }
};

