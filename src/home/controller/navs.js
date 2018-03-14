var _ = require('lodash');

module.exports = class extends think.cloveradmin.rest {

    async getAction() {
        let user = this.mongoose("user_info")
        const userService = this.service("user_info","account")
        const authService = this.service("authorize","account")
        let results = []
        let authed_nodes = this.authed_nodes
        function checkNavPermission(nav){
            if(!nav.link){
                return true
            }
            var node = nav.auth_node
            if(!node){
                node = nav.link.split("/").join(".")+".get"
            }
            return authed_nodes.indexOf(node)>=0

        }
        var navs = {}
        _.each(think.app.appConfigs,function(doc,app){
            if(doc["navs"])
                navs = _.merge(navs,doc["navs"])
        })
        _.each(navs,function(nav1,key1){
                console.log("_"+key1)
                var nav2Children = []
                _.each(nav1.children,function(nav2,key2){
                    console.log("_____"+key2)
                    nav2.alias = key2
                    nav2.children = nav2.children || []
                    if(nav2.children){
                        var nav3Children = []
                        _.each(nav2.children,function(nav3,key3){
                            console.log("__________"+key3)
                            nav3.alias = key3
                            if(checkNavPermission(nav3))
                                nav3Children.push(nav3)
                        })
                        nav2.children = nav3Children
                    }
                    if(checkNavPermission(nav2) && nav2.children.length>0)
                        nav2Children.push(nav2)
                    else if(checkNavPermission(nav2) && nav2.link)
                        nav2Children.push(nav2)

                })
                nav1.alias = key1
                nav1.ord = nav1.ord || 0;
                nav1.children = nav2Children;
                if(checkNavPermission(nav1) && nav1.children.length>0)
                    results.push(nav1)
            })
            results = _.sortBy(results,function(item){
                return -item.ord
            })


       return this.success(results);
    }
};
