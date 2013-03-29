# medea-clusterify

Add support for Node's `cluster` core API.  Spawn many processes using only the master to access Medea.

This is an addon for (Medea)[https://github.com/argo/medea], the all-JavaScript key-value store.

## Usage

### Initialize

To add support for clusters, just `clusterify` Medea.

```javascript
var Medea = require('medea');
var clusterify = require('medea-clusterify');

var MedeaCluster = clusterify(Medea);

var medea = new MedeaCluster();
```

### Setup Master

To start cluster mode, run `medea.setupMaster` in the master process.

```javascript
if (cluster.isMaster) {
  medea.setupMaster();

  // Go about your forking...
}
```

### Using Medea from Worker Processes

To use Medea from worker processes, it's business as usual.

```javascript
medea.open(function() {
  medea.get('favorite_nacho_topping', function(err, val) {
    console.log(val.toString()); // probably 'jalapenos'
  });
});
```

That's it!

Note that if you're doing a new `require('medea')` in worker processes, you may need to reclusterify.

## License

MIT
