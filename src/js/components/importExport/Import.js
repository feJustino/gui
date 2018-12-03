import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FilePond } from 'react-filepond';
import ImportExport from './ImportExport';
import HeadImportExport from './HeadImportExport';
import { GenericModal } from '../Modal';

export default class Import extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };

        this.dismiss = this.dismiss.bind(this);
        this.handleImport = this.handleImport.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
    }

    dismiss() {
        const { openModal } = this.props;
        openModal(false);
    }

    handleImport() {
        this.setState({ showModal: true });
    }

    handleShowModal(status) {
        this.setState({ showModal: status });
    }

    render() {
        const opType = { label: 'Save' };
        const title = 'Import new datas';
        const firstMessage = 'You are about to remove all data. Are you sure?';
        const { showModal } = this.state;
        const { openModal } = this.props;
        return (
            <div>
                <ImportExport
                    openModal={openModal}
                    toggleSidebar={this.dismiss}
                    save
                    label="Import"
                    handleClick={this.handleImport}
                >
                    <HeadImportExport main="true" icon="import-icon" title="Import" firstMessage="Upload your previous backup on portal." />
                    <FilePond />
                    { showModal ? (<GenericModal
                        title={title}
                        openModal={this.handleShowModal}
                        first_message={firstMessage}
                        op_type={opType}
                        btnLabel="Remove"
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
