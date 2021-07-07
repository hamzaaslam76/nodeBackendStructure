const express = require('express');
const { protect,restrictTo } = require('../controllers/authController');
const { getalltours, createtours, gettours, deletetours, checkBody, checkid, updateTour, TopCheapTour, getTourstats, monthlyPlan , getTourWithin,getDistances } = require('../controllers/toursController');
const { createReview} = require('../controllers/reviewController');
const reviewRouter = require('./reviewRouter');
const route = express.Router();

// nested route
// // POST /tour/343443gf/reviews
// // Get /tour/122323ds/reviews
// // Get /tour/3222222d/reviews/2332ds

// route
//     .route('/:tourId/reviews')
//     .post(protect, restrictTo('user'), createReview);

route.use('/:tourId/reviews' , reviewRouter)


route.param('id', checkid);
route.route('/top-5-cheap').get(TopCheapTour, getalltours);
route.route('/tour-stats').get(getTourstats);
route.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide' , 'guide') , monthlyPlan);

route.
    route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getTourWithin)

route
    .route('/distances/center/:latlng/unit/:unit')
    .get(getDistances)
route
.route('/')
.get(protect, getalltours)
.post(protect, restrictTo('admin', 'lead-guide') , checkBody,createtours);
route.route('/:id')
    .get(gettours)
    .put(protect, restrictTo('admin', 'lead-guide') , updateTour) 
    .delete(protect,restrictTo('admin' ,'lead-guide'),deletetours);


module.exports = route;