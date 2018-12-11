import React from 'react';
import PropTypes from 'prop-types';

const HeadImportExport = (props) => {
    const {
        main, icon, handleClick, title, firstMessage,
    } = props;
    if (!main) {
        return (
            <div
                onClick={() => {}}
                className="over head-sub"
                role="button"
                tabIndex={0}
                onKeyPress={handleClick}
            >
                <div className="head-icon">
                    <img src={`src/img/icons/${icon}.png`} alt="src/img/alarm/warning.png" />
                </div>
                <div className="head-text">
                    <div className="title">{title}</div>
                    <div className="subtitle">{firstMessage}</div>
                </div>
            </div>
        );
    }
    return (
        <div className="head">
            <div className="head-icon">
                <img src={`src/img/icons/${icon}.png`} alt="src/img/alarm/warning.png" />
            </div>
            <div className="head-text">
                <div className="title">{title}</div>
                <div className="subtitle">{firstMessage}</div>
            </div>
        </div>
    );
};

HeadImportExport.propTypes = {
    main: PropTypes.bool.isRequired,
    icon: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    firstMessage: PropTypes.string.isRequired,
};

export default HeadImportExport;
