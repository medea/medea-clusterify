var cluster = require('cluster');
var argo = require('argo-server');
var numCPUs = require('os').cpus().length;
var Medea = require('medea');
var clusterify = require('../clusterify');

var MedeaCluster = clusterify(Medea);

var medea = new MedeaCluster();

if (cluster.isMaster) {
  // Run medea.setupMaster() in the master process.
  medea.setupMaster();

  // Fork child processes.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Close Medea gracefully.
  ['SIGTERM','SIGINT'].forEach(function(ev) {
    process.on(ev, function() {
      medea.close();
    });
  });
} else {
  // Child process.  Business as usual.
  var server = argo()
    .get('/', function(handle) {
      handle('request', function(env, next) {
        medea.get(env.request.url, function(err, cached) {
          if (cached) {
            env.response.body = cached.toString();
            next(env);
          } else {
            env.response.body = 'Hello World!';
            medea.put(env.request.url, env.response.body, function(err) {
              next(env);
            });
          }
        });
      });
    });

  medea.open(function() {
    server.listen(3000);
    console.log('listening on port 3000');
  });
}
