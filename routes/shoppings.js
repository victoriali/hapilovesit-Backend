var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next){
	server.route([ 
		{
      method: 'PATCH',
      path: '/shoppings',
      handler: function(request, reply) {
      	Auth.authenticated(request, function(result){
      		if(result.authenticated){

		        var db = request.server.plugins['hapi-mongodb'].db;
		        var session = request.session.get('account_session');
		        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

		        var change={
		        	// 'user_id': ObjectId(session.user_id),
           //    'username': session.username,
           //    'itemName': request.payload.order.itemName,
           //    'itemQuantity': request.payload.order.itemQuantity,
           //    'itemSubtotal': request.payload.order.itemSubtotal,
           //    'shippingFirstName': request.payload.order.shippingFirstName,
           //    'shippingLastName': request.payload.order.shippingLastName,
           //    'shippingAddress': request.payload.order.shippingAddress,
           //    'shippingCity': request.payload.order.shippingCity,
           //    'shippingCountry': request.payload.order.shippingCountry,
           //    'shippingState': request.payload.order.shippingState,
           //    'shippingPostalCode': request.payload.order.shippingPostalCode,
           //    'shippingPhone': request.payload.order.shippingPhone,
           //    'billingFirstName': request.payload.order.billingFirstName,
           //    'billingLastName': request.payload.order.billingLastName,
           //    'billingAddress': request.payload.order.billingAddress,
           //    'billingCity': request.payload.order.billingCity,
           //    'billingCountry': request.payload.order.billingCountry,
           //    'billingState': request.payload.order.billingState,
           //    'billingPostalCode': request.payload.order.billingPostalCode,
           //    'billingPhone': request.payload.order.billingPhone,
           //    'shippingMethod': request.payload.order.shippingMethod,
           //    'paymentNameOnCard': request.payload.order.paymentNameOnCard,
           //    'paymentCardNumber': request.payload.order.paymentCardNumber,
           //    'paymentCCV': request.payload.order.paymentCCV,
           //    'paymentExpiryDate': request.payload.order.paymentExpiryDate,
           //    'paymentTotal': request.payload.order.paymentTotal,
           //    'orderTime': Date()
		        };

		        var order = request.payload.order;
		        var change = {
							user_id: ObjectId(session.user_id),
              username: session.username,
		        	order: order,
							orderTime: Date(),
		        }

	          db.collection('shoppings').update({ "user_id": ObjectId(session.user_id)},change,{upsert:true}, function(err, order) {
	            if (err) { return reply('Internal MongoDB error', err); }
	            reply(order);
	          });
		      } 
		      else {
		      	return reply('Please Login First')
		      }
	      });
      }
    }
	]);
	next();
};

exports.register.attributes = {
    name: 'shoppings-routes',
    version: '0.0.1'
}