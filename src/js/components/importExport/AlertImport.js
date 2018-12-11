import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    DojotBtnClassic,
} from '../DojotButton';

export default class AlertImport extends Component {
    constructor(props) {
        super(props);

        this.dismiss = this.dismiss.bind(this);
    }

    dismiss() {
        const { openModal } = this.props;
        openModal(false);
    }

    render() {
        const {
            title, firstMessage, label, click,
        } = this.props;
        return (
            <div className="">
                <div className="row confirm-modal-import">
                    <div className="confirm-modal-head">
                        <div className="col s4 img-alert">
                            <div><i className="fa fa-exclamation-triangle fa-4x" /></div>
                        </div>
                        <div className="col s8 message">
                            <div className="message-title left">{title}</div>
                            <div className="message-subtitle left">{firstMessage}</div>
                        </div>
                    </div>
                    <div className="col s12 text-right">
                        <DojotBtnClassic
                            is_secondary
                            onClick={this.dismiss}
                            label="Cancel"
                            title="Cancel"
                        />
                        <DojotBtnClassic
                            is_secondary={false}
                            onClick={() => click()}
                            label={label}
                            title={label}
                        />
                    </div>
                </div>
                <div className="modal-background" onClick={this.dismiss} />
            </div>
        );
    }
}

AlertImport.propTypes = {
    openModal: PropTypes.func.isRequired,
    click: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    firstMessage: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
