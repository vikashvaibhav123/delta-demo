const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema=Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.alternatives().try(
            Joi.string().allow("", null),
            Joi.object({
                url: Joi.string().allow("", null),
            }).unknown(true)
        ).optional(),
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required(),
});



// image: Joi.object({
//                 filename: Joi.string().allow("", null),
//                 url: Joi.string().allow("", null)
//             })