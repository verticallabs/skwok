var moment = require('moment-timezone');

function now() {
  return moment();
}

module.exports = {
  now: now 
}
