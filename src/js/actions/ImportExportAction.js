/* eslint-disable */
import ImportManager from '../comms/ImportExport/ImportManager';
import ExportManager from '../comms/ImportExport/ExportManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class ImportExportActions {
    exportFile(file) {
        return file;
    }

    insertUser(user) {
        return user;
    }

    import(user, cb, error_cb) {
        const newUser = user;
        return (dispatch) => {
        dispatch();
        ImportManager.import(newUser)
            .then((response) => {
            let updatedUser = JSON.parse(JSON.stringify(newUser));
            this.insertUser(updatedUser);
            if(cb){
                cb(response);
            }
            })
            .catch((error) => {
            if(error_cb) {
                error_cb(newUser);
            }
            this.usersFailed(error);

            })
        }
    }

    export() {
        return (dispatch) => {
            dispatch();
            ExportManager.export()
                .then((file) => {
                    console.log(file)
                    var file = new Blob([JSON.stringify(file)], {type: 'text/json'});
                    var atag = document.createElement("a");
                    atag.href = URL.createObjectURL(file);
                    atag.download = 'DojotData.json'
                    atag.click();
                    this.exportFile(file);
                })
                .catch((error) => {
                    this.exportFailed(error);
                });
        };
    }

    updateSingle(user) {
        return user;
    }

    removeSingle(user) {
        return user;
    }

    exportFailed(error) {
        toaster.error(error.message);
        return error;
    }
}

const _importexport = alt.createActions(ImportExportActions, exports);
export default _importexport;
