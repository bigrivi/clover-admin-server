
module.exports = class extends think.cloveradmin.rest {
    async _beforeItemResponse(item){
        let regionService = this.service("region","region")
        let region_path = await regionService.get_full_path(item.region)
        item["region"] = JSON.stringify(region_path)
    }


     async _beforeListResponse(list){
        let regionService = this.service("region","region")
        for(const item of list){
            item.region = await regionService.get_full_name(item.region)
        }

    }


};
