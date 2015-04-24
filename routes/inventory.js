var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next){
	server.route([ 

	]);
	next();
};

exports.register.attributes = {
    name: 'inventory-routes',
    version: '0.0.1'
}