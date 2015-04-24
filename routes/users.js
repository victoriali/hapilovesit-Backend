var Bcrypt = require('bcrypt');
var Joi = require('joi');

exports.register = function(server,options,next){

	server.route([ 
		//Sign Up-- Create an new user
		{
	    method: 'POST',
	    path: '/users',
	    config: {
		    handler: function(request, reply){
		      var db       = request.server.plugins['hapi-mongodb'].db;
		      var newUser = request.payload.user;

		      Bcrypt.genSalt(10, function(err, salt){
		      	Bcrypt.hash(newUser.password, salt, function(err, hash){
		      		newUser.password = hash;
				      var uniqUserQuery = {
				      	$or:[
				      		{ username: newUser.username },
				      		{ email: newUser.email }
				      ]};

				      db.collection('users').count(uniqUserQuery, function(err, userExist){
				      	if (userExist) {
				      		return reply({"Error": "Username already exist"});
				      	}

					      db.collection('users').insert(newUser,function(err, writeResult) {
						      if (err) { 
						        return reply('Internal MongoDB error', err);
						      }
						      reply(writeResult);
						    });
				      });
		      	})
		      });
		    },
	    	validate:{
	    		payload:{
	    			user:{
	    				username: Joi.string().max(20).required(),
	    				email: Joi.string().max(20).email().max(50).required(),
	    				password: Joi.string().min(5).max(20).required()
	    			}
	    		}
	    	}
	    }
	  }
	  // {
	  //   //retrieve all users
	  //   method: 'GET',
	  //   path: '/users',
	  //   handler: function(request, reply){
	  //     var db =request.server.plugins['hapi-mongodb'].db;

	  //     db.collection('users').find().toArray(function(err, users) {
	  //         if (err) { 
	  //             return reply('Internal MongoDB error', err);
	  //         }

	  //         reply(users);
	  //     });
	  //   }
	  // },
	]);  
  next();
};


exports.register.attributes = {
    name: 'users-routes',
    version: '0.0.1'
}