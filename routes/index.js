const categoryRoute = require('./categoryRoute');
const productRoute = require('./productRoute');
const authRoute = require('./authRoute');
const wishlistRoute = require('./wishlistRoute');
const userRoute = require('./userRoute');


const mountRoutes = (app) => {
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/products', productRoute);
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/wishlist', wishlistRoute);
  app.use('/users', userRoute);
};

module.exports = mountRoutes;