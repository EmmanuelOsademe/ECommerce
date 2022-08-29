const Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');
const cloudinary = require('../utils');
const { BadRequestError, NotFoundError } = require('../errors');

const createProduct = async (req, res) =>{
    const {name, description, price, category, company} = req.body;

    if(!(name && description && price && category && company)){
        throw new BadRequestError('Missing required field(s)');
    }

    req.body.user = req.user.userId;

    const product = await Product.create({...req.body})

    res.status(StatusCodes.CREATED).json({product});
};

const getAllProducts = async (req, res) =>{

    const {name, description, category, company, featured, freeShipping, sort, fields, numericalFilters} = req.query;
    const queryObject = {};

    if(featured){
        queryObject.featured = featured === 'true' ? true : false;
    }
    if(freeShipping){
        queryObject.freeShipping = freeShipping === 'true' ? true : false;
    }
    if(company){
        queryObject.company = company;
    }
    if(category){
        queryObject.category = category;
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'};
    }
    if(description){
        queryObject.description = {$regex: description, $options: 'i'};
    }
    if(numericalFilters){
        const operatorsMap = {
            '<': '$lt',
            '<=': '$lte',
            '=': '$eq',
            '>': '$gt',
            '>=': 'gte'
        };
        const regEx = /\b(>|>=|=|>|>=)\b/g;
        let filters = numericalFilters.replace(
            regEx, (match) => `-${operatorsMap[match]}-`
        );
        const options = ['price', 'averageRating', 'numOfReviews', 'inventory'];
        filters = filters.split(',').forEach((item) =>{
            const [field, operator, value] = item.split('-');
            if(options.includes(field)){
                queryObject[field] = {[operator] : Number(value)};
            }
        });
    };

    // Sort 
    if(sort){
        sortCriteria = sort.split(',').join(' ');
    }else{
        sortCriteria = 'createdAt'; 
    };

    // Filter by fields
    let filterOptions;
    if(fields){
        filterOptions = fields.split(',').join(' ');
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skips = (page - 1) * limit;

    const products = await Product.find(queryObject).select(filterOptions).sort(sortCriteria).skip(skips).limit(limit);
    res.status(StatusCodes.OK).json({products, count: products.length});
};

const getSingleProduct = async (req, res) =>{
    const {id: productId} = req.params;
    if(!productId){
        throw new BadRequestError(`Please provide product ID`);
    }

    const product = await Product.findOne({productId});
    if(!product){
        throw new NotFoundError(`No product with ID: ${productId}`);
    };

    res.status(StatusCodes.OK).json({product});
};

const updateProduct = async (req, res) =>{
    const {id: productId} = req.params;
    if(!productId){
        throw new BadRequestError('Please provide product ID');
    }

    const requestKeys = Object.keys(req.body);

    if(requestKeys.length === 0){
        throw new BadRequestError('Please provide field(s) for update');
    }

    const product = await Product.findOne({_id: productId});
    if(!product){
        throw new NotFoundError(`No product with ID: ${productId}`);
    }

    const fields = ['name', 'description', 'price', 'category', 'colors', 'featured', 
    'freeShipping', 'inventory', 'averageRating', 'numOfReviews', 'company'];

    requestKeys.forEach((key) =>{
        if(fields.indexOf(key) > -1){
            product[key] = req.body[key];
        }
    });

    await product.save();
    res.status(StatusCodes.OK).json({product});
};

const deleteProduct = async (req, res) =>{
    const {id: productId} = req.params;
    if(!productId){
        throw new BadRequestError('Please provide product ID');
    }

    const product = await Product.findOne({_id: productId});
    if(!product){
        throw new NotFoundError(`No product with ID: ${productId}`);
    }

    if(product.cloudinaryId){
        await cloudinary.uploader.destroy(product.cloudinaryId);
    }
    await product.remove();
    res.status(StatusCodes.OK).json({msg: `Success! Product has been removed`});
};

const uploadImage = async (req, res)=>{
    const {id: productId} = req.params;
    if(!productId){
        throw new BadRequestError('Please provide product ID');
    }
    const product = await Product.findOne({_id: productId});
    if(!product){
        throw new NotFoundError(`No product with ID: ${productId}`);
    };

    if(product.cloudinaryId){
        throw new BadRequestError(`Image already exist for product. You can update the image`);
    }
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {user_filename: true});

    product.image = uploadedImage.secure_url;
    product.cloudinaryId = result.public_id;
    
    await product.save();
    res.status(StatusCodes.OK).json({product});
};

const updateImage = async (req, res) =>{
    const {id: productId} = req.params;
    if(!productId){
        throw new BadRequestError('Please provide Product ID');
    }
    const product = await Product.findOne({productId});
    if(!product){
        throw new NotFoundError(`No Product with ID: ${productId}`);
    }

    await cloudinary.uploader.destroy(product.cloudinaryId);
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {user_filename: true});
    product.image = uploadedImage.secure_url;
    product.cloudinaryId = uploadedImage.public_id;

    await product.save();
    res.status(StatusCodes.OK).json({product});
};

module.exports = {createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage, updateImage};