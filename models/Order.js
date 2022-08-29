const mongoose = require('mongoose');

const singleOrderSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Please provide product ID']
        },
        productName: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            validate: {
                validator: function(num){
                    return ((typeof(num) === 'number') && (num % 1 === 0) && (num > 0))
                },
                message: props => `${props.path} must be an integer and greater than 0`
            }
        }
    }
);

const OrderSchema = new mongoose.Schema(
    {
        tax: {
            type: Number,
            required: [true, 'Please provide tax']
        },
        shippingFee: {
            type: Number,
            required: [true, 'Pleaser provide shipping fee']
        },
        subtotal: {
            type: Number,
            required: [true, 'Please provide subtotal']
        },
        total: {
            type: Number,
            required: true
        },
        orderItems: [singleOrderSchema],
        status:{
            type: String,
            enum: ['pending', 'paid', 'failed', 'delivered'],
            default: 'pending'
        },
        clientSecret:{
            type: String
        },
        paymentIntent: {
            type: String
        }, 
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    }, {timestamps: true}
);

module.exports = mongoose.model("Order", OrderSchema);