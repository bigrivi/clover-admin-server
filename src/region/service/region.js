

module.exports = class extends think.Service {

    constructor(ctx) {
        super(ctx);
    }

    async get_full_name(region_id){
        let path = await this.get_full_path(region_id)
        path = think._.map(path,(item)=>{
            return item.name
        })
        return path.join(" ")
    }


     async get_full_path(region_id){
        let all_regions = await this.get_all_region()
        let ret = []
        let region = all_regions[region_id]
        while(region && region.parent_id>=0){
            ret.unshift(region)
            region = all_regions[region.parent_id]
        }
        return ret
    }


     async get_all_region(){
        const cache_key = "all_regions_data"
        const cacheData = await think.cache(cache_key);
        if(cacheData){
            return cacheData
        }
        const region = this.mongoose("region")
        let regions = await region.find({}).exec()
        let ret = {}
        regions.forEach((item)=>{
            ret[item.region_id] = {
                region_id:item.region_id,
                parent_id:item.parent_id,
                name:item.name,
                type:item.type
            }
        })
        await think.cache(cache_key, ret);
        return ret;

    }




};
