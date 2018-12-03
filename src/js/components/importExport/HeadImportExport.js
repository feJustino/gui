import React from 'react';

const HeadImportExport = (props) => {
    const main = props.main;
    if (!main) {
        return (
            <div
                onClick={props.handleClick}
                className="over head-sub"
                role="button"
                tabIndex={0}
            >
                <div className="head-icon">
                    <img src={`src/img/icons/${props.icon}.png`} alt="src/img/alarm/warning.png" />
                </div>
                <div className="head-text">
                    <div className="title">{props.title}</div>
                    <div className="subtitle">{props.firstMessage}</div>
                </div>
            </div>
        );
    }
    return (
        <div className="head">
            <div className="head-icon">
                <img src={`src/img/icons/${props.icon}.png`} alt="src/img/alarm/warning.png" />
            </div>
            <div className="head-text">
                <div className="title">{props.title}</div>
                <div className="subtitle">{props.firstMessage}</div>
            </div>
        </div>
    );
}


export default HeadImportExport;
