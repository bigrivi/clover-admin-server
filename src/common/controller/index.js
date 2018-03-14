const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    think.logger.error('index');
    return this.display();
  }
};
