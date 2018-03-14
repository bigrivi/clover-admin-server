const lodash = require("lodash")
const path = require("path")

module.exports = {
    _:lodash,
    cloveradmin:{
        rest:require(path.join(think.APP_PATH,"common","controller","rest")),
        model:require(path.join(think.APP_PATH,"common","model","base")),
        tree:require(path.join(think.APP_PATH,"common","model","tree"))
    }
}