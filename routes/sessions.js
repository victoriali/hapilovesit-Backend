var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next){

	server.route([ 
		//User login (create session)
		{
	    method: 'POST',
	    path: '/sessions',
	    config: {
		    handler: function(request, reply){
		      var db       = request.server.plugins['hapi-mongodb'].db;
		      var userLogin = request.payload.user;

		      db.collection('users').findOne({"username":userLogin.username},function(err,userMongo){
		      	if (err) {return reply('Internal Mongo error',err);}

		      	if (userMongo === null){
		      		return reply ({"message":"User doesn't exist"});
		      	}

		      	Bcrypt.compare(userLogin.password,userMongo.password, function(err,match){
		      		if (match){
		      			function randomKeyGenerator() {
    							return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
  							}
   
  						// Generate a random key
	  						var randomKey = (randomKeyGenerator() + randomKeyGenerator() + "-" + randomKeyGenerator() + "-4" + randomKeyGenerator().substr(0,3) + "-" + randomKeyGenerator() + "-" + randomKeyGenerator() + randomKeyGenerator() + randomKeyGenerator()).toLowerCase();

	  						var newSession = {
	  							"session_id":randomKey,
	  							"user_id":userMongo._id,
	  							"username":userMongo.username//!!!!!!
	  						};
	  					//take the random key to database
	  						db.collection('sessions').insert(newSession,function(err,writeResult){
	  							if (err) {return reply('Internal Mongo error',err);}
	  					//send the same random key to browser
	  							request.session.set("account_session",{
	  								"session_key":randomKey,
	  								"user_id":userMongo._id
	  							});
	  							return reply(writeResult);
	  						});

		      		}else{
		      			reply({"message":"Not Authorised"})
		      		}
		      	});
		      });
		    }
	    }
	  },
	  //Match with database?
	  {
	  	method: "GET",
	  	path: "/authenticated",
	  	handler: function(request,reply){
	  		Auth.authenticated(request,function(result){
	  			reply(result);
	  		});
	  	}
	  },
	  //User logout (delete session)
	  {
	  	method: "DELETE",
	  	path: "/sessions",
	  	handler: function(request,reply){
	  		var session = request.session.get("account_session");
	  		var db = request.server.plugins['hapi-mongodb'].db;

	  		if(!session){
	  			return reply({'message':'Already logged out'})
	  		}

	  		db.collection('sessions').remove({'session_id':session.session_key}, function(err, writeResult){
	  			if (err) {return reply('Internal Mongo error',err);}
	  			return reply(writeResult);
	  		});
	  	}
	  }
	]);   
  next();
};


exports.register.attributes = {
    name: 'sessions-routes',
    version: '0.0.1'
}