var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next){
	server.route([ 
	//GET all orders by the user who has logged in (require authentication)
	  {
      method: 'POST',
      path: '/echo',
      handler: function(request, reply) {
        reply(request.payload);
	    }
    },
    {
      method: 'GET',
      path: '/orders',
      handler: function(request, reply) {
      	Auth.authenticated(request, function(result){
      		if(result.authenticated){

		        var db = request.server.plugins['hapi-mongodb'].db;
		        var session = request.session.get('account_session');
		        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

	          db.collection('orders').find({ "user_id": ObjectId(session.user_id)}).toArray(function(err, orders) {
	            if (err) { return reply('Internal MongoDB error', err); }
	            reply(orders);
	          });
		      } 
		      else {
		      	return reply('Please Login First')
		      }
	      });
      }
    },

  //POST new order (require authentication)
  	{
  		method: 'POST',
      path: '/orders',
      config: {  
        handler: function(request, reply) {
          // first authenticate the user
          Auth.authenticated(request, function(result){
          	
            if(result.authenticated) {
            
              var db = request.server.plugins['hapi-mongodb'].db;
              var session = request.session.get('account_session');
              var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

              db.collection('users').findOne({ "_id": ObjectId(session.user_id) }, function(err, user) {
                if (err) { return reply('Internal MongoDB error', err); }

                // var order = request.payload.order;
                var order = {
                  'user_id': ObjectId(session.user_id),
                  // 'username': session.username,
                  'items': request.payload.order,
                  // 'items': [{
	                 //  'name': request.payload.order.itemName,
	                 //  'quantity': request.payload.order.itemQuantity,
	                 //  'price': request.payload.order.itemPrice
                  // }],
                  // 'shipping': {
	                 //  'FirstName': request.payload.order.shipping.FirstName,
	                 //  'LastName': request.payload.order.shippingLastName,
	                 //  'Address': {
		                //   'Street': request.payload.order.shippingAddress,
		                //   'City': request.payload.order.shippingCity,
		                //   'Country': request.payload.order.shippingCountry,
		                //   'State': request.payload.order.shippingState,
		                //   'PostalCode': request.payload.order.shippingPostalCode
	                 //  },
	                 //  'Phone': request.payload.order.shippingPhone
                  // },
                  // 'billing':{
                  // 	'FirstName': request.payload.order.billingFirstName,
                  // 	'LastName': request.payload.order.billingLastName,
                  // 	'Address': {
		                //   'Street': request.payload.order.billingAddress,
		                //   'City': request.payload.order.billingCity,
		                //   'Country': request.payload.order.billingCountry,
		                //   'State': request.payload.order.billingState,
		                //   'PostalCode': request.payload.order.billingPostalCode
                  // 	},
                  // 	'Phone': request.payload.order.billingPhone
                  // }
                  'shippingMethod': request.payload.order.shippingMethod,
                  'orderTime': Date()
                };

                db.collection('orders').insert( order, function(err, writeResult){
                  if(err) {
                    return reply('Internal MongoDB error', err);
                  } else {
                    reply(writeResult);
                  }
                });
              });
            } else {
              reply(result);
            }
          });
        },
        // validate: {
        //   payload: {
        //     tweet: {
        //       message: Joi.string().max(140).required(),
        //     }
        //   }
        // }
      }
  	}
	]);
	next();
};

exports.register.attributes = {
    name: 'orders-routes',
    version: '0.0.1'
}