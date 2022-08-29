const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Please provide product name'],
            minLength: [5, `Product name cannot be less than 5 characters`],
            maxLength: [20, 'Product name cannot be more than 20 characters']
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
            minLength: [10, 'Product description cannot be less than 10 characters'],
            maxLength: [500, 'Product description cannot be more than 500 characters']
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price']
        },
        category:{
            type: String,
            required: [true, 'Please provide product category'],
            enum: {
                values: ['fashion', 'electronics', 'bedroom', 'computing', 'office', 'kitchen'],
                message: '{VALUE} is not support'
            }
        },
        colors: {
            type: [String],
            default: ['#222']
        },
        company: {
            type: String,
            required: [true, 'Please provide company name'],
            enum: {
                values: ['ikea', 'liddy', 'marcos', 'asda'],
                message: '{VALUE} not supported'
            }
        },
        image: {
            type: String,
            default: '/upload/example.jpeg'
        },
        cloudinaryId: {
            type: String
        },
        featured: {
            type: Boolean,
            default: false
        },
        freeShipping: {
            type: Boolean,
            default: false
        },
        inventory: {
            type: Number,
            default: 15
        },
        averageRating: {
            type: Number,
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

ProductSchema.virtual('reviews', {
    ref: "Review",
    localField: '_id',
    foreignField: 'product',
    justOne: false
});

ProductSchema.pre('remove', async function(next){
    await this.model('Review').deleteMany({product: this._id});
    next();
});

module.exports = mongoose.model('Product', ProductSchema);