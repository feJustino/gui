import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deviceManager from '../../comms/devices/DeviceManager';

import DeviceStore from '../../stores/DeviceStore';
import DeviceActions from '../../actions/DeviceActions';
import TemplateStore from '../../stores/TemplateStore';
import TemplateActions from '../../actions/TemplateActions';
import MeasureStore from '../../stores/MeasureStore';
import MeasureActions from '../../actions/MeasureActions';

import PageHeader from "../../containers/full/PageHeader";
import Filter from "../utils/Filter";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router'

function TagList (props) {
  const tags = props.tags;
  return (
    <span>
      { tags.map((tag) => <span key={tag}>{tag}</span>) }
    </span>
  )
}

function SummaryItem(props) {
  let status = "disabled";
  if (props.device.status) {
    status = "online";
  } else {
    if (('enabled' in props.device) && props.device.enabled) {
      status = "offline";
    }
  }

  return (
    <div className="lst-entry-wrapper z-depth-2 col s12">
      <div className="lst-entry-title col s12">
        <span>{props.device.label}</span>
        <span className={"badge " + status}>{status}</span>
      </div>

      <div className="lst-entry-body col s12">
        {/* TODO fill those with actual metrics */}
        <div className="col s4 metric">
          <div className="metric-label">Attributes</div>
          <div className="metric-value">value</div>
        </div>
        <div className="col s4 metric">
          <div className="metric-label">Last update</div>
          <div className="metric-value">VALUE</div>
        </div>
        <div className="col s4 metric">
          <div className="metric-label">Uptime</div>
          <div className="metric-value">12345</div>
        </div>
      </div>
    </div>
  )
}

class DetailItem extends Component {
  constructor(props) {
    super(props);

    const status = props.device.status ? 'online' : 'offline';

    this.state =  {
      measures: MeasureStore.getState().measures
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount() {
    MeasureStore.listen(this.onChange);
    MeasureActions.fetchMeasures("temperature");
  }

  componentWillUnmount() {
    MeasureStore.unlisten(this.onChange);
  }

  getFormattedDate(timestamp) {
    let date = new Date(timestamp);
    let formattedDate = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear()
                        + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
    return formattedDate;
  }

  render() {
    return (
      <span>
        <div className="lst-detail" >
          <div className="lst-line col s10">
            <div className="lst-title col s12">
              <span>{this.props.device.label}</span>
            </div>
            <div className="col s12">
              <div className="col s12 data">{this.props.device.id}</div>
              <div className="col s12 data">{status}</div>
              <div className="col s12 data">{this.props.device.type}</div>
              <div className="col s12 data"><TagList tags={this.props.device.tags}/></div>
            </div>
            <div className="lst-title col s12">
              <span>Measures</span>
            </div>
            <div className="col s12">
              <div className="col s6">Timestamp</div>
              <div className="col s6">Values</div>
              { this.state.measures.map((measure) =>(
                <div className="col s12" key={measure}>
                  <div className="col s6 data">
                    {measure[0]}
                  </div>
                  <div className="col s6 data">
                    {measure[2]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col s2">
            <div className="edit right inline-actions">
              <a className="btn-floating waves-green right" onClick={this.props.handleDismiss}>
                <i className="fa fa-times"></i>
              </a>
              <a className="btn-floating waves-green right" onClick={this.props.handleEdit}>
                <i className="material-icons">mode_edit</i>
              </a>
            </div>
          </div>
        </div>
        <div className="row" >
          {/* device extended detail area */}
        </div>
      </span>
    )
  }
}

// @TODO actually this could make use of alt's container boilerplate
class EditWrapper extends Component {
  constructor(props) {
    super(props);

    this.state =  {
      device: props.device,
      templates: TemplateStore.getState().templates
    }

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount() {
    TemplateStore.listen(this.onChange);
    TemplateActions.fetchTemplates();
  }

  componentWillUnmount() {
    TemplateStore.unlisten(this.onChange);
  }

  handleSubmit(e) {
    e.preventDefault();
    DeviceActions.triggerUpdate(this.state);
  }

  handleFieldChange(e) {
    let state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  handleRemove(e) {
    DeviceActions.triggerRemoval(this.props.device);
  }

  onChange(templates) {
    this.setState({device: this.state.device, templates: templates.templates});
  }

  render() {
    return (
      <EditItem device={this.state.device} templates={this.state.templates}
                handleSubmit={this.handleSubmit}
                handleRemove={this.handleRemove}
                handleFieldChange={this.handleFieldChange}
                handleDismiss={this.props.handleDismiss} />
    )
  }
}

class EditItem extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    let callback = this.props.handleFieldChange.bind(this);
    let sElement = ReactDOM.findDOMNode(this.refs.dropdown);
    $(sElement).ready(function() {
      $('select').material_select();
      $('#fld_deviceTypes').on('change', callback);
    });

    Materialize.updateTextFields();
  }

  render() {
    const status = this.props.device.status ? 'online' : 'offline'
    return (
      <form>
        <div className="lst-edit" >
          <div className="lst-line col s10">
            <div className="lst-title col s12 input-field">
              <label htmlFor="fld_label">Label</label>
              <input id="fld_label" type="text"
                     name="label" value={this.props.device.label}
                     key="label" onChange={this.props.handleFieldChange} />
            </div>
            <div className="col s12">
              <div className="row">
                <div className="col s12 m4">{this.props.device.id}</div>
                <div className="col s12 m4">{status}</div>
              </div>
              <div className="row">
                <div className="col s12">
                  <label htmlFor="fld_deviceTypes">Template</label>
                  <select id="fld_deviceTypes"
                          name="type"
                          ref="dropdown"
                          value={this.props.device.type}
                          onChange={this.handleChange}>
                    <option value="" disabled>Select type</option>
                    {this.props.templates.map((type) => <option value={type.id} key={type.id}>{type.label}</option>)}
                  </select>
                </div>
              </div>
              {/* @TODO add missing tags field */}
              {/* @TODO add missing custom attrs field */}
            </div>
          </div>

          <div className="col s2">
            <div className="edit right inline-actions">
              <a className="btn-floating waves-green right" onClick={this.props.handleDismiss}>
                <i className="fa fa-times"></i>
              </a>
              <a className="btn-floating waves-light red right" onClick={this.props.handleRemove}>
                <i className="fa fa-trash-o" />
              </a>
            </div>
          </div>
        </div>
        <div className="col s12">
          {/* this should actually be on the top menu, shouldn't it? */}
          <div className="pull-right">
            <a onClick={this.props.handleSubmit}
               className=" modal-action modal-close waves-effect waves-green btn-flat">Send
            </a>
          </div>
        </div>
      </form>
    )
  }
}

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleDetail(e) {
    e.preventDefault();
    this.props.detailedTemplate(this.props.device.id);
  }

  handleEdit(e) {
    e.preventDefault();
    this.props.editTemplate(this.props.device.id);
  }

  handleDismiss(e) {
    e.preventDefault();
    this.props.detailedTemplate(undefined);
  }

  handleRemove(e) {
    e.preventDefault();
  }

  render() {
    const detail = this.props.detail === this.props.device.id;
    const edit = (this.props.edit === this.props.device.id) && detail;

    // let outerClass = "lst-entry row ";
    // if (detail) { outerClass = outerClass + "detail"}
    // if (detail) { outerClass = outerClass + "edit"}

    return (
      <div className="lst-entry col s12 m6 l4" id={this.props.device.id} onClick={detail ? null : this.handleDetail}>
        { detail && edit && (
          <EditWrapper device={this.props.device} handleRemove={this.handleRemove} handleDismiss={this.handleDismiss}/>
        )}
        { detail && !edit && (
          <DetailItem device={this.props.device} handleEdit={this.handleEdit} handleDismiss={this.handleDismiss}/>
        )}
        { !detail && (
          <SummaryItem device={this.props.device} />
        )}
      </div>
    )
  }
}

function ListRender(props) {
  const deviceList = props.devices;

  if (deviceList.length > 0) {
    return (
      <div className="row">
        <div className="col s12  lst-wrapper">
          { deviceList.map((device) =>
            <ListItem device={device} key={device.id}
              detail={props.detail}
              detailedTemplate={props.detailedTemplate}
              edit={props.edit}
              editTemplate={props.editTemplate} />
          )}
        </div>
      </div>
    )
  } else {
    return  (
      <div className="col s12">
        <span className="background-info">No configured devices</span>
      </div>
    )
  }
}

function MapRender(props) {
  const deviceList = props.devices;
  return (
    <div>
      <p>map goes here!</p>
    </div>
  )
}

class DeviceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayList: true,
      filter: '',
    };

    this.handleViewChange = this.handleViewChange.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
    this.detailedTemplate = this.detailedTemplate.bind(this);
    this.editTemplate = this.editTemplate.bind(this);
  }

  handleViewChange(event) {
    this.setState({isDisplayList: ! this.state.isDisplayList})
  }

  detailedTemplate(id) {
    let temp = this.state;

    if (this.state.detail && this.state.edit) {
      console.log("are you sure???");
      if (id === undefined) {
        temp.edit = undefined;
      }
    }

    temp.detail = id;
    this.setState(temp);
    return true;
  }

  editTemplate(id) {
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      this.setState(temp);
      return true;
    }

    return false;
  }

  // handleSearchChange(event) {
  //   const filter = event.target.value;
  //   let state = this.state;
  //   state.filter = filter;
  //   state.detail = undefined;
  //   this.setState(state);
  // }

  applyFiltering(deviceList) {
    const filter = this.state.filter;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);

    return deviceList.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });
  }

  render() {
    const filteredList = this.applyFiltering(this.props.devices);

    return (
      <div className="col m10 s12 offset-m1 " >

        { this.state.isDisplayList === false && <MapRender devices={filteredList}/>  }
        { this.state.isDisplayList && <ListRender devices={filteredList}
                                                  detail={this.state.detail}
                                                  detailedTemplate={this.detailedTemplate}
                                                  edit={this.state.edit}
                                                  editTemplate={this.editTemplate}/> }

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>
      </div>
    )
  }
}

class DeviceTag extends Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(e) {
    this.props.removeTag(this.props.tag);
  }

  render() {
    return (
      <div key={this.props.tag}>
        {this.props.tag} &nbsp;
        <a title="Remove tag" className="btn-item" onClick={this.handleRemove}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

class NewDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newDevice: {
        id: "",
        label: "",
        type: "",
        tags: []
      },
      newTag: "",
      options: [ "MQTT", "CoAP", "Virtual" ]
    }

    this.addTag = this.addTag.bind(this);
    this.updateTag = this.updateTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.createDevice = this.createDevice.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // this allows us to remove the global script required by materialize as in docs
  componentDidMount() {
    let callback = this.handleChange.bind(this);

    let sElement = ReactDOM.findDOMNode(this.refs.dropdown);
    $(sElement).ready(function() {
      $('select').material_select();
      $('#fld_deviceTypes').on('change', callback);
    });

    let mElement = ReactDOM.findDOMNode(this.refs.modal);
    $(mElement).ready(function() {
      $('.modal').modal();
    })
  }

  updateTag(e) {
    let state = this.state;
    state.tag = e.target.value;
    this.setState(state);
  }

  addTag(e) {
    let temp = this.state.newDevice;
    temp.tags.push(this.state.tag);
    this.setState({ newDevice: temp});
  }

  removeTag(tag) {
    let temp = this.state.newDevice;
    for (let i = 0; i < temp.tags.length; i++) {
      if (temp.tags[i] === tag) {
        temp.tags.splice(i, 1);
      }
    }

    this.setState({newDevice: temp});
  }

  createDevice() {
    DeviceActions.addDevice(JSON.parse(JSON.stringify(this.state.newDevice)));
  }

  handleChange(event) {
    const target = event.target;
    let state = this.state.newDevice;
    state[target.name] = target.value;
    this.setState({
      newDevice: state
    });
  }

  render() {
    return (
      <div>
        <div id="newDeviceBtn" className="" >
          <button data-target="newDeviceForm" className="btn waves-effect waves-light btn-default" >
            <i className="fa fa-plus fa-2x"></i>
          </button>
        </div>
        <div className="modal" id="newDeviceForm" ref="modal">
          <div className="modal-content">
            <div className="row">
              {/* <h2>New device</h2> */}
            </div>
            <div className="row">
              <div className="col s10 offset-s1">
                <form role="form">
                  {/* <!-- name --> */}
                  <div className="row">
                    <div className="input-field col s12">
                      <label htmlFor="fld_name">Name</label>
                      <input id="fld_name" type="text"
                             name="label"
                             onChange={this.handleChange}
                             value={this.state.newDevice.label} />
                    </div>
                  </div>
                  {/* <!-- device type --> */}
                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="fld_deviceTypes" >Type</label>
                      <select id="fld_deviceTypes"
                              name="type"
                              ref="dropdown"
                              value={this.state.newDevice.type}
                              onChange={this.handleChange}>
                        <option value="" disabled>Select type</option>
                        {this.state.options.map((type) => <option value={type} key={type}>{type}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* <!-- tags --> */}
                  <div className="row">
                    <div className="col s11">
                      <div className="input-field">
                        <label htmlFor="fld_newTag" >Tag</label>
                        <input id="fld_newTag" type="text"
                                               value={this.state.tag}
                                               onChange={this.updateTag} />
                      </div>
                    </div>
                    <div className="col s1" >
                      <div title="Add tag"
                           className="btn btn-item btn-floating waves-effect waves-light cyan darken-2"
                           onClick={this.addTag}>
                        <i className="fa fa-plus"></i>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="wrapping-list">
                      { this.state.newDevice.tags.map((tag) =>(
                          <DeviceTag key={tag} tag={tag} removeTag={this.removeTag} />
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="pull-right">
                <a onClick={this.createDevice}
                   className=" modal-action modal-close waves-effect waves-green btn-flat">Create</a>
                <a className=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Devices extends Component {

  constructor(props) {
    super(props);

    this.state = DeviceStore.getState();
    this.onChange = this.onChange.bind(this);
    this.filterChange = this.filterChange.bind(this);
  }

  componentDidMount() {
    DeviceStore.listen(this.onChange);
    DeviceActions.fetchDevices();
  }

  componentWillUnmount() {
    DeviceStore.unlisten(this.onChange);
  }

  onChange(newState) {
    this.setState(DeviceStore.getState());
  }

  filterChange(newFilter) {
    console.log("about to change filter: " + newFilter);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500} >
        <PageHeader title="device manager" subtitle="Devices">
          <Filter onChange={this.filterChange} />
        </PageHeader>
        <DeviceList devices={this.state.devices}/>
        <NewDevice />
      </ReactCSSTransitionGroup>
    );
  }
}

import { ViewDevice } from './SingleDevice'
module.exports = { Devices, ViewDevice }
