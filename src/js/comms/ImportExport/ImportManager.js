import util from '../util/util';

class ImportManager {
    constructor() {
        this.baseUrl = 'https://private-anon-71f566cda9-eliasreis.apiary-mock.com/import';
    }

    Import(file) {
        return util.POST(this.baseUrl, file);
    }
}

const importManager = new ImportManager();
export default importManager;
