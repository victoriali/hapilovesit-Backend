var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next){
	server.route([ 
		{//show all tweets
	  	method: "GET",
	  	path: "/tweets",
	  	handler: function(request,reply){
	  		var db = request.server.plugins['hapi-mongodb'].db;

	  		db.collection('tweets').find().toArray(function(err, tweets){
	  			if (err) {return reply('Internal Mongo error',err);}
	  			return reply(tweets);
	  		});
	  	}
	  },
	  {//get all tweets by specific user
	  	method: "GET",
	  	path: "/users/{username}/tweets",
	  	handler: function(request,reply){
	  		var db = request.server.plugins['hapi-mongodb'].db;
	  		var username = encodeURIComponent(request.params.username);

	  		db.collection('users').findOne({"username":username},function(err, user){
	  			if (err) {return reply('Internal Mongo error',err);}
	  			db.collection('tweets').find({"user_id":user._id}).toArray(function(err, tweets){
	  				if (err) {return reply('Internal Mongo error',err);}
	  				return reply(tweets);
	  			});
		   	});
	  	}
	  },
	  {//create a tweet
	  	method: "POST",
	  	path: "/tweets",
		  config:{
		  	handler: function(request,reply){
		  		var db = request.server.plugins['hapi-mongodb'].db;
		  		var session = request.session.get("twitter_session");
		  		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

		  		var tweet = { 
	  				"message": request.payload.tweet.message,
	  				"user_id": ObjectId(session.user_id)
					};

		  		Auth.authenticated(request,function(result){
		  			if(result.authenticated === true){
			  			db.collection('tweets').insert(tweet,function(err, writeResult){
			  				if (err) {return reply('Internal Mongo error',err);}
			  				return reply(tweet);
			  			});
		  			}else{
		  				reply({"message":"Not Authorised"})
		  			};
		  		});
		  	}
		  }	
	  },
	  {//reading a single tweet
	  	method: "GET",
	  	path: "/tweets/{id}",
	  	handler: function(request,reply){
	  		var db = request.server.plugins['hapi-mongodb'].db;
	  		var tweetId = encodeURIComponent(request.params.id);
	  		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

	  		db.collection('tweets').findOne({"_id":ObjectId(tweetId)},function(err, tweet){
	  			if (err) {return reply('Internal Mongo error',err);}
	  			return reply(tweet);
		   	});
	  	}
	  },
	  {//deleting a tweet
	  	method: "DELETE",
	  	path: "/tweets/{id}",
	  	handler: function(request,reply){
	  		var db = request.server.plugins['hapi-mongodb'].db;
	  		var tweetId = encodeURIComponent(request.params.id);
	  		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

	  		db.collection('tweets').remove({"_id":ObjectId(tweetId)},function(err, tweet){
	  			if (err) {return reply('Internal Mongo error',err);}
	  			return reply(tweet);
		   	});
	  	}
	  }
	]);
	next();
};

exports.register.attributes = {
    name: 'tweets-routes',
    version: '0.0.1'
}