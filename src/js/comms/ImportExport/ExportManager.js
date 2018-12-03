import util from '../util/util';

class ExportManager {
    constructor() {
        this.baseUrl = 'https://private-anon-71f566cda9-eliasreis.apiary-mock.com/export';
    }

    Export() {
        return util.GET(this.baseUrl);
    }
}

const exportManager = new ExportManager();
export default exportManager;
