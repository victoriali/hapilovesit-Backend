exports.register = function(server,options,next){
	server.route([ 
    {
      method: 'GET',
      path: '/pastboxes',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('pastboxes').find().toArray(function(err, pastboxes) {
          if (err) { return reply('Internal MongoDB error', err); }
          reply(pastboxes);
        });
      }
    },
    {
      method: 'POST',
      path: '/pastboxes',
      config: {  
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var pastbox = {
            "BoxURL": request.payload.pastbox.boxURL,
            "BoxTitle": request.payload.pastbox.boxTitle
          }
          db.collection('pastboxes').insert(pastbox, function(err,writeResult){
            if (err) { 
              return reply('Internal MongoDB error', err);
            }
            reply(writeResult);
          });
        }
      }
    }
	]);
	next();
};

exports.register.attributes = {
    name: 'pastboxes-routes',
    version: '0.0.1'
}