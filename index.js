var Hapi = require('Hapi'); //go to node_modules to see if it can find it ()
var server = new Hapi.Server(); // we take Server.js from Hapi library

server.connection({
	host:'0.0.0.0', //same as localhost
	port: process.env.PORT || 3000, //What is process.env.PORT? It's an environment variable prepared by Heroku Deployment
	routes: {
		cors: {
      headers: ['Access-Control-Allow-Credentials'],
      credentials: true
    }// cors: true //Cross-origin resource sharing is a mechanism that enables many resources on a webpage
	}
});
// var yarOptions = {
// 	cookieOptions:{
// 		password:'password',//password to access password base
// 		isSecure: false // you can use it without HTTPS
// 	}
// };

// server.register({
// 	register: require('yar'),
// 	options: yarOptions
// },function(err){
//  //do nothing with error
// });

var plugins = [
	{ register: require('./routes/users.js')},
	{ register: require('./routes/sessions.js')},
	{
		register:require('hapi-mongodb'),
		options: {
			"url":"mongodb://127.0.0.1:27017/hapi-twitter",
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

server.register(plugins,function(err) {//server please recognise these plugin(libaries)
	if (err) {
		throw err;
	}

	server.start(function() {
		server.log('info', 'Server running at: ' + server.info.uri);
	});
});