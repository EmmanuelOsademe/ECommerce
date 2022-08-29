const {StatusCodes} = require('http-status-codes');
const Review = require('../models/Review');
const {BadRequestError, NotFoundError} = require('../errors');
const {checkAdminOrAuthorisedUser} = require('../middlewares/authentication');

const createReview = async (req, res) =>{
    if(!req.body){
        throw new BadRequestError(`Missing required field(s)`);
    };
    req.body.user = req.user.userId;

    const oldReview = await Review.findOne({product: req.body.product, user: req.user.userId});
    if(oldReview){
        throw new BadRequestError('You already have a review for this product. You may update the review');
    }

    const review = await Review.create({...req.body});
    res.status(StatusCodes.CREATED).json({review});
};

const updateReview = async (req, res) =>{
    const {id: reviewId} = req.params;
    if(!reviewId){
        throw new BadRequestError('Please provide review ID');
    }
    const {rating, comment} = req.body;
    if(!rating && !comment){
        throw new BadRequestError('Please provide Rating or Comment for update');
    }
    const review = await Review.findOne({_id: reviewId, user:req.user.userId});
    if(!review){
        throw new NotFoundError(`No Review with ID: ${reviewId}`);
    };
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(StatusCodes.OK).json({review});
};

const getAllReviews = async (req, res) =>{
    const reviews = await Review.find({});
    res.status(StatusCodes.OK).json({reviews});
};

const getSingleReview = async (req, res) =>{
    const {id: reviewId} = req.params;
    if(!reviewId){
        throw new BadRequestError('Please provide Review ID');
    }
    const review = await Review.findOne({_id: reviewId});
    if(!review){
        throw new NotFoundError(`No Review with ID: ${reviewId}`);
    }
    checkAdminOrAuthorisedUser(req.user, review.user);
    res.status(StatusCodes.OK).json({review});
};

const deleteReview = async (req, res) =>{
    const {id: reviewId} = req.params;
    if(!reviewId){
        throw new BadRequestError(`Please provide Review ID`);
    };
    const review = await Review.findOne({_id: reviewId});
    if(!review){
        throw new NotFoundError(`No review with ID: ${reviewId}`);
    };

    await review.remove();
    res.status(StatusCodes.OK).json({msg: `Success! Review removed`});
}

module.exports = {createReview, updateReview, getAllReviews, getSingleReview, deleteReview};