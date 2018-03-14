const mongoose = require('mongoose');
const ignoreProperties = ['constructor', '__filename', 'schema'];

const extend = function(target, source, properties) {
  const length = properties.length;
  for (let i = 0; i < length; i++) {
    const property = properties[i];
    const descriptor = Object.getOwnPropertyDescriptor(source, property);
    if (descriptor.get && descriptor.set) {
      Object.defineProperty(target, property, {
        configurable: true,
        get: descriptor.get,
        set: descriptor.set
      });
    } else if (descriptor.get) {
      // target.__defineGetter__(property, descriptor.get);
      Object.defineProperty(target, property, {
        configurable: true,
        get: descriptor.get
      });
    } else if (descriptor.set) {
      // target.__defineSetter__(property, descriptor.set);
      Object.defineProperty(target, property, { /* eslint accessor-pairs: ["error", { "setWithoutGet": false }] */
        configurable: true,
        set: descriptor.set
      });
    } else if (descriptor.hasOwnProperty('value')) { // could be undefined but writable
      target[property] = descriptor.value;
    }
  }
  return target;
};


const extendClassMethods = function(target, source) {
    let obj = source;
    do {
    if (obj === Object.prototype) break;
    const properties = Object.getOwnPropertyNames(obj).filter(item => ignoreProperties.indexOf(item) === -1);
    extend(target, obj, properties);
    } while ((obj = Object.getPrototypeOf(obj)));
};

module.exports = class {
   constructor(modelName){
	    let schema = this.schema;
		if (!(schema instanceof mongoose.Schema)) {
		  schema = new mongoose.Schema(schema);
		}
		const model = mongoose.model(modelName, schema,modelName);
		let modelClass = class extends model {};
		extendClassMethods(modelClass, this);
		return modelClass;
   }
};
