import * as React from 'react';
import $ from 'jquery';
import { 
    Modal, 
    // Button, 
    ModalHeader, 
    ModalBody
} from 'reactstrap';

import { base_url } from '../constants';

import 'bootstrap/dist/css/bootstrap.min.css';

import { ModalTitle } from 'react-bootstrap';

/**
 * A component that contains a modal that allows the user to select axis
 *  and subset data from the axis
 * 
 * props:
 *  variable: string, the name of the selected variable
 *  file_path: string, the path to the file containing the variable
 *  show: function bound to parent
 */
class VariableConfig extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            variablesAxes: null,
            selectedVariable: props.selectedVariable || '',
            file_name: props.file_name || '',
            dimension: null,
            axisList: null
        };

        this.getVariableInfo = this.getVariableInfo.bind(this);
        this.show = this.show.bind(this);
        this.callApi = this.callApi.bind(this);
    }
    /**
     * Toggles the modal. If moving from hidden to shown, calls getVariableInfo
     */
    show(){
        if(this.state.show == false){
            this.setState({show: true});
            this.getVariableInfo(
                this.state.file_name,
                this.state.selectedVariable);
        } else {
            this.setState({show: false});
        }
    }
    /** 
     * Requests information about the variable from the backend
     * 
     * Parameters:
     *  file_name: string, the name of the file to lookup axis information about
     *  var_name: string, the name of the variable
     * Returns:
     *  none
     * State Changes:
     *  axisList = result.axisList,
    */
    getVariableInfo(file_name: string, var_name: string) {
        let params = $.param({
            file_name: this.state.file_name,
            var_name: this.state.selectedVariable
        });
        let url = base_url + '/get_axis?' + params;

        try {
            this.callApi(url).then(variablesAxes => {
                let selectedVariable, dimension;
                selectedVariable = variablesAxes[0];
                dimension = $.extend(true, [], this.props.variables[this.props.active_variable].dimension);
                if (dimension.length === 0) {
                    dimension = variablesAxes[0].axisList.map(name => {
                        return { axisName: name };
                    });
                }
                if (this.props.variables[this.props.active_variable].json) {
                    selectedVariable.json = this.props.variables[this.props.active_variable].json;
                }
                this.setState({
                    selectedVariable,
                    variablesAxes,
                    axisList: selectedVariable.axisList,
                    dimension
                });
            });
        } catch (e) {
            console.warn(e);
        }
    }
    /**
     * Make a backend API call, and decode the json response
     * 
     * Parameters:
     *  url: string, the url to send the request to, with parameters encoded
     * Returns:
     *  Promise -> json decoding promise
     */
    callApi = async (url: string) => {
        const response = await fetch(url);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }
    render(){
        return (
            <Modal show={this.show} bsSize="large" onHide={this.show}>
                <ModalHeader closeButton>
                    <ModalTitle>Edit Variable Axis</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {this.state.axisList.map(axis => {
                        return (
                            <div></div>
                        );
                    })}
                </ModalBody>
            </Modal>
        );
    }
}