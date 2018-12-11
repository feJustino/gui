import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { FilePond, File, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import toaster from '../../comms/util/materialize';
import ImportExport from './ImportExport';
import HeadImportExport from './HeadImportExport';
import AlertImport from './AlertImport';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default class Import extends Component {
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
        console.log('text.size :', text.size);
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
        const label = 'Save';
        const title = 'Import new datas';
        const firstMessage = 'You will remove all data. Are you sure?';
        const { showModal, file } = this.state;
        const { openModal } = this.props;
        return (
            <div>
                <ImportExport
                    openModal={openModal}
                    toggleSidebar={this.dismiss}
                    save
                    label="Import"
                    handleClick={this.handleOpenModal}
                >
                    <HeadImportExport main="true" icon="import-icon" title="Import" firstMessage="Drag the a file JSON to restore your data." />
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
};
