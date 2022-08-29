const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, 'Please provide user ID']
        },
        products: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: [true, "Please provide product ID"]
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
        ]
    }, {timestamps: true}
);

module.exports = mongoose.model("Cart", CartSchema);