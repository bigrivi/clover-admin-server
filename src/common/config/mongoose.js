const helper = require('think-helper');
const path = require('path');

module.exports = app => {
  function model(name, config, m = 'common') {
    return think.app.MongooseModels[name];
  };

  function injectModel(name, config, m) {
    return think.app.MongooseModels[name]
  }

  return {
    think: {
      mongoose: injectModel
    },
    service: {
      mongoose: injectModel
    },
    controller: {
      mongoose(name, config, m) {
        return this.ctx.mongoose(name, config, m);
      }
    },
    context: {
      mongoose(name, config, m = this.module) {
        return model(name, config, m);
      }
    }
  };
};