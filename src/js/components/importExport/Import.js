import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { FilePond, File, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { translate } from 'react-i18next';
import toaster from '../../comms/util/materialize';
import ImportExport from './ImportExport';
import HeadImportExport from './HeadImportExport';
import AlertImport from './AlertImport';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

class Import extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            file: [],
        };
        this.pond = createRef();
        this.file = createRef();
        this.dismiss = this.dismiss.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }


    dismiss() {
        const { openModal } = this.props;
        openModal(false);
    }

    handleOpenModal() {
        const { file } = this.state;
        if (file.length > 0) {
            this.setState({ showModal: true });
        } else {
            toaster.error('Select one file!');
        }
    }

    openModal(status) {
        this.setState({ showModal: status });
    }

    uploadFile() {
        const { file } = this.state;
        const text = file[0];
        if (file.length > 0) {
            const reader = new FileReader();
            reader.readAsText(text, 'UTF-8');
            reader.onload = (evt) => {
                console.log(evt.target.result);
            };
            reader.onerror = (evt) => {
                toaster.error('Error reading file');
            };
        } else {
            toaster.error('Select one file!');
        }
    }

    render() {
        const { openModal, t } = this.props;
        const { showModal, file } = this.state;
        const label = t('button.save.label');
        const title = t('importExport.alert.title');
        const firstMessage = t('importExport.alert.sub');
        return (
            <div>
                <ImportExport
                    openModal={openModal}
                    toggleSidebar={this.dismiss}
                    save
                    label={t('importExport.import.button')}
                    handleClick={this.handleOpenModal}
                >
                    <HeadImportExport main icon="import-icon" title={t('importExport.import.title')} firstMessage={t('importExport.import.subImport')} />
                    <FilePond
                        ref={this.pond}
                        onupdatefiles={(fileItems) => {
                            this.setState({
                                file: fileItems.map(fileItem => fileItem.file),
                            });
                        }}
                        allowFileTypeValidation
                        acceptedFileTypes={['application/json']}
                        allowFileSizeValidation
                        maxTotalFileSize={10000}
                    >
                        {file.map(files => (
                            <File
                                key={files}
                                src={files}
                                origin="local"
                            />
                        ))}
                    </FilePond>
                    { showModal ? (<AlertImport
                        title={title}
                        openModal={this.openModal}
                        firstMessage={firstMessage}
                        label={label}
                        click={this.uploadFile}
                    />
                    ) : null }
                </ImportExport>
            </div>
        );
    }
}

Import.propTypes = {
    openModal: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

export default translate()(Import);
