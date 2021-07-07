const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures');
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc)
        {
           return next(new AppError("no document found with that  id", 404));
            }
        res.status(204).json({
            status: "success",
            data:null
        });
   
})

exports.updateOne = Model => catchAsync(async (req, res,next) => {
    //try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc)
        {
           return next(new AppError("this record was not exist in database", 404));
            }
        res.status(200).json({
            status: "success",
            data: {
                doc
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

exports.create = Model => catchAsync(async (req, res, next) => {
    // allow nested route
    
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review: doc
        }
    })
});

exports.getOne = (Model , popOptions) => catchAsync (async (req, res,next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
     if (!doc)
     {
        return next(new AppError("this record was not exist in database", 404));
         }
        
        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
    });   
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    // to allow for nested GET review on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId }
    
    const features = new APIFeatures(Model.find(filter), req.query).filter().sorts().limitFields().pagination();
      // explain the query of document show the detail of the query      
    // const doc = await features.query.explain();
    const doc = await features.query;
   
    res.status(200).json({
        status: 'success',
        requesttime: res.requestTime,
        results: doc.length,
        data: {
            doc
        }
    });
})
