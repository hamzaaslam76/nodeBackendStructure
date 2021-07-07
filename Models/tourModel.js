const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('./userModel');
const toursscheema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: [40, 'A name of the tour must be less then 40 character'],
        minlength: [8, 'A name of the tour must be greater then 8 character'],
       // validate: [validator.isAlpha,'Tour name only contain alpha']
    },
    slug:String,
    duration: {
        type: Number,
       required:[true,'A tour must have a durations']  
    },
    maxGroupSize: {
        type: Number,
        required:[true,'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulaty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message:'difficulity is either easy,medium and difficult'
        }
      
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'reating must be greater then 1'],
        max: [5, 'rating must be less then 5'],
        set: val => Math.round(val * 10) /10  // 4.6666 // 4.7  // 46.6666 // 47
     },
    ratingsQuantity: {
        type: Number,
        default:0
    },
    price: {
        type: Number,
        required: [true, 'price must be enter'],
        default:2000 
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (evl) {
                return evl < this.price;
            },
            message:'Discount price ({VALUE}) should be blow redular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required:[true,'A tour must have a description']
    },
    description: {
        type: String,
        trim:true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        //hide field
        select:false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default:false
    },
    startLocation: {
        // GeoJson
        type: {
            type: String,
            default: 'Point',
            enum:['Point']
        },
        coordinates: [Number],
        address: String,
        description:String
        
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum:['Point'] 
            },
            coordinates: [Number],
            address: String,
            description: String,
            day:Number
        }
    ],
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    }]
},
    {
    toJSON: { virtuals: true },
    toObject:{virtuals:true}
    });

// create index for search data

toursscheema.index({ price: 1, ratingsAverage: -1 })
toursscheema.index({ slug: 1 }); 
toursscheema.index({ startLocation: '2dsphere' });

// mebaded relationship without rafrance 

// toursscheema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })



//add new  in document
toursscheema.virtual("durationweek").get(function () {
    return this.duration / 7; 
});
// virtual populate model

toursscheema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

//Document Middleware run before .save() .create()
toursscheema.pre('save', function (next) {
    this.slug = slugify(this.name, { lowar: true });
    next(); 
});

// query middeware 
toursscheema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } }); 
    this.start = Date.now();
    next(); 
});
// get refrance data using popolate

toursscheema.pre(/^find/, function (next) {
    this.populate({
        
        path: 'guides',
// this field not be show in data
        select:'-__v '
    });
    next()
})

toursscheema.post(/^find/, function (doc ,next) {
    console.log(`Query took ${Date.now() - this.start} millisecond`);
    next();
    
});

// aggregation middeware

// toursscheema.pre('aggregate', function (next) {
//    this.pipeline().unshift( {
//     $match: { secretTour : { $ne: true } }  
//   });
//     console.log(this.pipeline());
//     next();
// });
const Tour = mongoose.model('Tour', toursscheema);


module.exports = Tour;  