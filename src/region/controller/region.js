module.exports = class extends think.cloveradmin.rest  {

    async getAction1(){
        let regionService = this.service("region")
        let regions = await regionService.get_all_region()
        console.log(regions.length)
        return this.success({})
    }

};
