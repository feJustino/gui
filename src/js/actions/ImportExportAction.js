/* eslint-disable */
import ImportManager from '../comms/ImportExport/ImportManager';
import ExportManager from '../comms/ImportExport/ExportManager';
import toaster from '../comms/util/materialize';
import Axios from 'axios';

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
        Axios({
            url: 'http://api.dev/file-download',
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.json');
            document.body.appendChild(link);
            link.click();
        });
        
        return (dispatch) => {
            dispatch();
            ExportManager.export()
                .then((file) => {
                    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
                    this.exportFile(data);
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
