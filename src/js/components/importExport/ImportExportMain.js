import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import ImportExportAction from '../../actions/ImportExportAction';
import ImportExport from './ImportExport';
import HeadImportExport from './HeadImportExport';
import Import from './Import';

class ImportExportMain extends Component {
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
        ImportExportAction.export();
    }

    render() {
        const { openModal, toggleSidebar, t } = this.props;
        const { openImport } = this.state;
        return (
            <div>
                <ImportExport
                    openModal={openModal}
                    toggleSidebar={toggleSidebar}
                    save={false}
                >
                    <div className="">
                        <HeadImportExport main icon="import-export-icon" title={t('importExport.mainTitle')} firstMessage="" />
                    </div>
                    <div className="">
                        <HeadImportExport handleClick={this.handleImport} icon="import-icon" title={t('importExport.import.title')} firstMessage={t('importExport.import.sub')} />
                    </div>
                    <div className="">
                        <HeadImportExport handleClick={this.handleExport} icon="export-icon" title={t('importExport.export.title')} firstMessage={t('importExport.export.sub')} />
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
    t: PropTypes.func.isRequired,
};

export default translate()(ImportExportMain);
