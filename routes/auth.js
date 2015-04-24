module.exports = {},

module.exports.authenticated = function(request,callback){
	var session = request.session.get("account_session");
	var db = request.server.plugins['hapi-mongodb'].db;

	if(!session){
		return callback({
			'message':'Not login',
			'authenticated':false
		});
		//return will terminate the test of program
	}

	db.collection('sessions').findOne({'session_id':session.session_key}, function(err, result){
		if(result === null){
			return callback({
				'message':'Unauthenticated',
				'authenticated':false
			})
		} else{
			return callback({
				"message":"Authenticated",
				'authenticated':true,
				user: result.username
			});
		}
	});

};