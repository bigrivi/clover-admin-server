var _ = require('lodash');

module.exports = class extends think.cloveradmin.rest {

    async getAction() {
       const i18nService = this.service("i18n")
       var lang = this.get("lang") || "zh-cn"
       let langData = await i18nService.getLangData(lang)
       return this.success(langData);
    }
};
