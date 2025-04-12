const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['localhost'], // Matches the Docker container's exposed port
  localDataCenter: 'datacenter1',
  keyspace: 'user_profiles',
  credentials: {
    username: 'admin',
    password: 'admin',
  },
});

module.exports = client;
