
const fs = require('fs');
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
const Tour = require('../Models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory')
//middale ware
exports.TopCheapTour = (req, res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsQuantity,price';
    req.query.fields = 'name,price,ratingsQuantity,summary';
    next();
}
// const catchAsync = fn => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(err => next(err));
//     }
// }
exports.getalltours = catchAsync (async (req, res,next) => {
   
        //  // Built Query
        // // 1 Filtering
        // const queryObj = { ...req.query };
        // const excludedfield = ['sort', 'limit', 'page','fields']
        // excludedfield.forEach(el => delete queryObj[el]);
        // console.log(req.query, 'query obj',queryObj);

        // // 2 advance filtring
        // let querystr = JSON.stringify(queryObj);
        // console.log('check ob', querystr);
        // querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    

    //Filtring method in monggose
       // let Query = Tour.find(JSON.parse(querystr));
        // 3 Sorting
        // if (req.query.sort)
        // {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     Query = Query.sort(sortBy);
        //     }
        // else {
        //       Query = Query.sort('-createdAt')
        // }
        
        //4 limited
        // if (req.query.fields)
        // {
        //     const fields = req.query.fields.split(',').join(' ');
        //     console.log(fields);
        //     Query = Query.select(fields);
        // }
        // else {
        //     Query = Query.select('-__v');
            
        // }
        //5 pagination
        // const page = req.query.page *1 || 1;
        // const limitOfRecord = req.query.limit * 1 || 20;
        // const skipRecord = (page - 1) * limitOfRecord;
        // Query.skip(skipRecord).limit(limitOfRecord);
        // if (req.query.page)
        // {
        //     const numTour = await Tour.countDocuments();
        //     console.log('skip', skipRecord, 'count', numTour);
        //     if (skipRecord >= numTour)throw new Error("this page does not exist");
        // }
        // execute query
        const features = new APIFeatures(Tour.find(), req.query).filter().sorts().limitFields().pagination();
        const ListOftours = await features.query;
       // const ListOftours = await Tour.find({ difficulty: 'easy', duration: '5' });
        //const ListOftours = await Tour.find().where("difficulty").equals('easy').where('duration').equals(5);
       // send response
        res.status(200).json({
            status: 'success',
            requesttime: res.requestTime,
            results: ListOftours.length,
            data: {
                ListOftours
            }
        });
});
exports.gettours = factory.getOne(Tour, { path: 'reviews' });
// exports.gettours = catchAsync (async (req, res,next) => {
//     // try catch was not use because use blobal catch Async 
//    // try {
//     const tour = await Tour.findById(req.params.id).populate('reviews');// this populate use in midalwalre //.populate({
        
// //         path: 'guides',
// // // this field not be show in data
// //         select:'-__v '
// //     });
//      if (!tour)
//      {
//         return next(new AppError("this record was not exist in database", 404));
//          }
//         // an other method
//        // const tour = await Tour.findOne({ '_id': req.params.id });
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 tour
//             }
//         });
//     // }
//     // catch (err)
//     // {
        
//     //         return res.status(404).json({
//     //             message: "data not found"
//     //         });
    
//     // }
//    // const tour = tours.find(el => el.id === (req.params.id * 1));
    
   
// });
exports.createtours = catchAsync(async (req, res,next) => {
    
    // this code use when use File

    // const newid = tours[tours.length - 1].id + 1;
    // const newtours = Object.assign({id:newid },req.body);
    // tours.push(newtours);
    //fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
    //  if (err) console.log("file cannot write" + err);
   // try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                newTour
            }
           
        });
    // }
    // catch (err) {
    //     res.status(400).json({
    //         status: "my reruest fail fail ",
    //         message: err
           
    //     });
    // }
    //});
});

exports.deletetours = factory.deleteOne(Tour);

// use general function then comment this code

// exports.deletetours = async (req, res) => {
//     //this code use when use file system
//     // const tour = tours.find(el => el.id === (req.params.id * 1));
//     // if (!tour) {
//     //     return res.status(404).json({
//     //         message: "data not found"
//     //     });
//     // }
//     // tours.pop(tour);
//     // res.status(200).json({
//     //     status: 'success',
//     //     data: {
//     //         tour
//     //     }
//     // });
//     try {
//         const deleteTour = await Tour.findByIdAndDelete(req.params.id);
//         if (!deleteTour)
//         {
//            return next(new AppError("this record was not exist in database", 404));
//             }
//         res.status(202).json({
//             message:"record deleted"
//         })
//     }
//     catch (err)
//     {
//         res.status(404).json({
//            message:err
//         });
//     }
// };

exports.updateTour = catchAsync(async (req, res,next) => {
    //try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!tour)
        {
           return next(new AppError("this record was not exist in database", 404));
            }
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    // }
    // catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     });
    // }

});

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price)
    {
        res.status(404).json({
            status: "fail",
            message: "user name not be defined, price"
        });
    }
    next();
}
exports.checkid = (req, res, next, val) => {
    if (req.params.id * 1 > tours.length)
    {
        res.status(400).json({
            status: 'fail',
            message:'id greater then length'
        })
    }
    next();
}

exports.getTourstats = catchAsync(async (req, res,next) => {
   // try {
        const stats = await Tour.aggregate([
           
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTour: { $sum: 1 },
                    numRating: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    MaxPrice: { $max: '$price' },
                    sum: { $sum: '$price' }
                }
            },
            {
                $sort: { avgPrice: -1 }
            },
            // {
            //     $match:{_id:{$ne:'EASY'}}
            // }
        ]);
        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        })
        
    // } catch (err) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })

    // }
    
});

exports.monthlyPlan = catchAsync(async (req, res,next) => {
    //try {
        const year = req.params.year * 1;
        console.log("year", year);
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numOfTourstart: { $sum: 1 }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numOfTourstart: -1 }
            },
            {
                $limit: 6
            }

        ]);
        res.status(200).json({
            status: 'success',
            totaldata: plan.length,
            data: {
                plan
            }
        })
    // }
    // catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
    
});

// '/tours-within/:distance/center/:latlag/unit/:unit')
// '/tours-within/233/center/34.1212,-118.3333/unit/mi')
exports.getTourWithin = catchAsync( async(req,res,next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; 
    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in the formate lat,lag .',400))
    }
    
    const tours = await Tour.find({startLocation: {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ]}}});
  
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
        
    })
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi'? 0.000621371: 0.001
    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in the formate lat,lag .', 400))
    }
    
    const tours = await Tour.aggregate([
        { 
            $geoNear: {
                near: {
                    type: 'point',
                    coordinates:[lng * 1 , lat *1 ]
                },
                distanceField: 'distance',
                distanceMultiplier:multiplier
            },
            
        },
        {
            $project: {
                distance: 1,
                name:1
            }
        }
    ]);
  
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
        
    })
});