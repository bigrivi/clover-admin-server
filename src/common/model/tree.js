let base = require("./base")

module.exports = class extends base {

    async get_tree(parentId,includeParent,populates){
        var parentData; //根级数据
        var findParams = {}
        var results;
        if(parentId){
          findParams._id = parentId;
        }
        parentData = await this.findOne(findParams).sort({ _id: 1 }).exec()
        if(!includeParent){
            parentData['lft'] += 1;
            parentData['rgt'] -= 1;
        }
        results = this.find({lft: { $gte: parentData["lft"], $lte: parentData["rgt"] }}).sort({ lft: 1 })
        if(populates){
            results = results.populate(populates)
        }
        results = await results.exec()
        var right = [];
        think._.each(results,function(row,index){
            if(right.length>0){
                // 检查是否应该将节点移出堆栈
                while(right[right.length-1]<row["rgt"]){
                    right.pop();
                }
            }
            var rightLength = right.length;
            if(rightLength > 0) {
                row["prefix"] = "|"+'---'.repeat(rightLength)
            } else {
                row["prefix"] = "";
            }
            row["name"] = row["prefix"]+row["name"];
            right.push(row["rgt"])
        })
        return results
    }

    async add_child(parentId,data){
        if(parentId){
            var conditions,update,options,parentInfo;
            parentInfo = await this.findById(parentId)
            //更新右值 start
            conditions = { rgt:{"$gte":parentInfo["rgt"]}};
            update = { "$inc": { rgt: 2 }}
            options = { multi: true };
            await this.update(conditions, update, options);
            //end
            //更新左值 start
            conditions = { lft:{"$gt":parentInfo["rgt"]}};
            update = { "$inc": { lft: 2 }}
            options = { multi: true };
            await this.update(conditions, update, options);
            //end
            data.lft = parentInfo["rgt"];
            data.rgt = parentInfo["rgt"]+1;
            data.depth = parentInfo["depth"]+1;

        }
        else{
            data.lft = 1;
            data.rgt = 2;
            data.depth = 1;
        }
        const res = await this.create(data);
        return res
    }


    async remove_node(node_id){
        let node_info = await this.findById(node_id);
        let conditions,update,options,parentInfo;
        if(node_info["lft"]==1){
            return -1;
        }
        var need_minus = node_info['rgt'] - node_info['lft'] + 1;
        need_minus = need_minus*-1
        conditions = { lft:{"$gte":node_info["lft"],"$lte":node_info["rgt"]}};
        await this.remove(conditions);

        conditions = { rgt:{"$gt":node_info["rgt"]}};
        update = { "$inc": { rgt: need_minus }}
        options = { multi: true };
        await this.update(conditions, update, options)

        conditions = { lft:{"$gt":node_info["rgt"]}};
        update = { "$inc": { lft: need_minus }}
        options = { multi: true };
        await this.update(conditions, update, options)
        return 0


    }


};




