import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import ImportExportAction from '../../actions/ImportExportAction';
import ImportExport from './ImportExport';
import HeadImportExport from './HeadImportExport';
import Import from './Import';

export default class ImportExportMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openImport: false,
        };
        this.handleImport = this.handleImport.bind(this);
        this.openImport = this.openImport.bind(this);
        this.handleExport = this.handleExport.bind(this);
    }

    handleImport() {
        this.setState({ openImport: true });
    }

    openImport(status) {
        this.setState({ openImport: status });
    }

    handleExport() {

    }

    render() {
        const { openModal, toggleSidebar } = this.props;
        const { openImport } = this.state;
        return (
            <div>
                <ImportExport
                    openModal={openModal}
                    toggleSidebar={toggleSidebar}
                    save={false}
                >
                    <div className="">
                        <HeadImportExport main="true" icon="import-export-icon" title="Import/Export Managment" firstMessage="" />
                    </div>
                    <div className="">
                        <HeadImportExport handleClick={this.handleImport} icon="import-icon" title="Import" firstMessage="Upload your previous backup on portal." />
                    </div>
                    <div className="">
                        <HeadImportExport handleClick={this.handleExport} icon="export-icon" title="Export" firstMessage="Receive a file containing all your data." />
                    </div>
                </ImportExport>
                {openImport ? <Import openModal={this.openImport} /> : null}
            </div>
        );
    }
}

ImportExportMain.propTypes = {
    openModal: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};
