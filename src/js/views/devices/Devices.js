import React, { Component } from 'react';
import DeviceStore from '../../stores/DeviceStore';
import MeasureStore from '../../stores/MeasureStore';
import DeviceActions from '../../actions/DeviceActions';
import MeasureActions from '../../actions/MeasureActions';
import { NewPageHeader } from "../../containers/full/PageHeader";
import AltContainer from 'alt-container';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { DojotBtnLink } from "../../components/DojotButton";
import {DeviceMap} from './DeviceMap';
import {DeviceCardList} from './DeviceCard';
import util from '../../comms/util';

// UI elements
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toggle from 'material-ui/Toggle';


function ToggleWidget(props) {
  return <div className="box-sh">
      <div className="toggle-icon" onClick={props.setState.bind(this,false)}>
        <img src="images/icons/pin.png" />
      </div>
      <div className="toggle-map">
        <MuiThemeProvider>
          <Toggle label="" defaultToggled={props.toggleState} onToggle={props.toggle} />
        </MuiThemeProvider>
      </div>
      <div className="toggle-icon" onClick={props.setState.bind(this,true)}>
        <i className="fa fa-th-large" aria-hidden="true" />
      </div>
    </div>;
}

class MapWrapper extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    let devices = this.props.devices;
    for(let deviceID in devices){
      for(let templateID in devices[deviceID].attrs){
        for(let attrID in devices[deviceID].attrs[templateID]){
          if(devices[deviceID].attrs[templateID][attrID].type === "dynamic"){
            if(devices[deviceID].attrs[templateID][attrID].value_type === "geo:point"){
                MeasureActions.fetchPosition.defer(devices[deviceID], devices[deviceID].id, devices[deviceID].attrs[templateID][attrID].label);
            }
          }
        }
      }
    }
  }

  render(){
    return(
      <AltContainer store={MeasureStore}>
        <DeviceMap devices={this.props.devices}/>
      </AltContainer>
    )
  }
}


class DeviceOperations {
  constructor() {
    this.filterParams = {};

    this.paginationParams = {
      page_size: 6,
      page_num: 1
    }; // default parameters
  }

  whenUpdatePagination(config) {
    for (let key in config) this.paginationParams[key] = config[key];
    this._fetch();
  }

  whenUpdateFilter(config) {
    this.filterParams = config;
    this._fetch();
  }

  _fetch() {
    let res = Object.assign({}, this.paginationParams, this.filterParams);
    console.log("fetching: ", res);
    DeviceActions.fetchDevices(res);
  }
}


// TODO: this is an awful quick hack - this should be better scoped.
var device_list_socket = null;
let dev_opex = new DeviceOperations();

class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = { displayList: true, showFilter: false };

    this.toggleSearchBar = this.toggleSearchBar.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.opex2 = 'testing';
  }

  componentDidMount() {
    // DeviceActions.fetchDevices.defer();
    opex._fetch();
    console.log("this.opex2",this.opex2);

    // Realtime
    let socketio = require('socket.io-client');

    const target = `${window.location.protocol}//${window.location.host}`;
    const token_url = target + "/stream/socketio";

    function getWsToken() {
      util._runFetch(token_url)
        .then((reply) => {
          init(reply.token);
        })
        .catch((error) => {
          console.log("Failed!", error);
        });
    }

    function init(token){
      device_list_socket = socketio(target, { query: "token=" + token, transports: ['polling'] });

      device_list_socket.on('all', function(data){
        console.log("received socket information:", data);
        MeasureActions.appendMeasures(data);
        DeviceActions.updateStatus(data);
      });

      device_list_socket.on('error', (data) => {
        console.log("socket error", data);
        socket.close();
        getWsToken();
      })
    }

    getWsToken();
  }

  componentWillUnmount(){
    device_list_socket.close();
  }


  toggleSearchBar() {
    this.setState({ showFilter: !this.state.showFilter });
  }

  setDisplay(state) {
    this.setState({ displayList: state });
  }

  toggleDisplay() {
    const last = this.state.displayList;
    this.setState({ displayList: !last });
  }

    render() {
        const detail =
            "detail" in this.props.location.query
                ? this.props.location.query.detail
                : null;
        const displayToggle = (
            <ToggleWidget
                toggleState={this.state.displayList}
                toggle={this.toggleDisplay}
                setState={this.setDisplay}
            />
        );
        return (
        <div className={"full-device-area"}>
            <AltContainer store={DeviceStore}>
              <NewPageHeader title="Devices" subtitle="" icon="device">
                <Pagination showPainel={this.state.showPagination} ops={dev_opex} />
                <OperationsHeader displayToggle={displayToggle} toggleSearchBar={this.toggleSearchBar.bind(this)} />
              </NewPageHeader>
              {this.state.displayList ? <DeviceCardList deviceid={detail} toggle={displayToggle} dev_opex={dev_opex} showSearchBox={this.state.showFilter} /> : <MapWrapper deviceid={detail} toggle={displayToggle} showSearchBox={this.state.showFilter} dev_opex={dev_opex} />}
            </AltContainer>
          </div>
        )
    }
}

function OperationsHeader(props) {
  return (
    <div className="col s5 pull-right pt10">
      <div
        className="searchBtn"
        title="Show search bar"
        onClick={props.toggleSearchBar}>
        <i className="fa fa-search" />
      </div>
      {props.displayToggle}
      <DojotBtnLink
        linkto="/device/new"
        label="New Device"
        alt="Create a new device"
        icon="fa fa-plus"
      />
    </div>
  )
}

export { Devices };
