var rest = require("./rest")

module.exports = class extends rest {
    async exportAction(){
        this.modelInstance = this.mongoose(this.get("resource"));
        return this.success({export:10000})
      }


};
