module.exports = class extends think.cloveradmin.rest {
   async listAction(){
      let department = this.mongoose("department")
      var populates = {path: 'leader',select: 'realname',}
      let trees = await department.get_tree(null,true,populates)
      if(this.get("limit") && this.get("skip"))
        return this.success({record_count:trees.length,data:trees})
      else
        return this.success(trees)

   }


   async postAction(){
        const data = this.post();
        let department = this.mongoose("department")
        const res = await department.add_child(data.parentId,data);
        return this.success(res);
   }


    async deleteAction(id){
        let department = this.mongoose("department")
        let ret = await department.remove_node(this.id)
        if(ret<0){
            return this.fail("根级分类不可删除")
        }
        return this.success({})

    }

};
