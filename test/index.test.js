var TogglEvents = require('..');

describe('toggl-events', function() {
  it('is alive!', function(done) {
    new TogglEvents().on('open', function() {
      done();
    });
  });
});
