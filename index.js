var Hapi = require('hapi'); //go to node_modules to see if it can find it ()
var server = new Hapi.Server(); // we take Server.js from Hapi library

server.connection({
	host:'0.0.0.0', //same as localhost
	port: process.env.PORT || 3000, //What is process.env.PORT? It's an environment variable prepared by Heroku Deployment
	routes: {
		cors: {
      headers: ['Access-Control-Allow-Credentials'],
      credentials: true
    }
	}
});

var plugins = [
	{ register: require('./routes/users.js')},
	{ register: require('./routes/sessions.js')},
	{ register: require('./routes/orders.js')},
	{ register: require('./routes/pastboxes.js')},
	{
		register:require('hapi-mongodb'),
		options: {
			// "url":"mongodb://127.0.0.1:27017/hapilovesit-project",
			"url":"mongodb://heroku_50ms5w2d:9j3djh3kcgeqdjg4ounnsfkt65@ds061198.mongolab.com:61198/heroku_50ms5w2d",
			"settings":{
				"db":{
					"native_parser": false
				}
			}
		}
	},
	{
		register: require('yar'),
		options:{
			cookieOptions:{
				password:'password',//password to access password base
				isSecure: false // you can use it without HTTPS
			}
		}
	}
];

server.route({
	method: 'GET',
	path: '/',
	handler: function (request,reply) {
		reply('<h1> Hi! </h1>');
	}
});

server.register(plugins,function(err) {//server please recognise these plugin(libaries)
	if (err) {
		throw err;
	}

	server.start(function() {
		console.log('info', 'Server running at: ' + server.info.uri);
	});
});