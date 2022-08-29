const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'Please provide name'],
            minLength: [2, 'Name rannot be less that 2 characters'],
            maxLength: [50, 'Name cannot be more that 50 characters']
        },
        email: {
            type: String,
            unique: [true, "Email already exist. Please provide another email"],
            required: [true, "Please provide email"],
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email"
            },
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minLength: [8, "Password cannot be less than 8 characters"]
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        }
    }, {timestamps: true}
);

UserSchema.pre('save', async function(next){
    console.log(this.isModified('password'));
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


/*UserSchema.path('email').validate(async (email) =>{
    const emailCount = await mongoose.models.User.countDocuments({email});
    if(emailCount !== 0) return false;
    return !emailCount;
}, "Email already exists");*/

UserSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);