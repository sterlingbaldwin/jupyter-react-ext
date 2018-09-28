import * as $ from 'jquery';

import * as React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../../style/vcs_config.css';

import { base_url, vcs_port } from '../constants';

// the global vcs object loaded from the visualization server
declare var vcs: any;

export class VCSConfig extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            file_path: this.props.file_path,
            console: this.props.console,
            selected_var: '',
            graphicsmethod: '',
            template: '',
            dropdownOpen: false,
            vars: [],
            gms: ['isofill', 'boxfill', 'meshfill']
        };
        this.vcs = this.props.vcs;

        this.props = props;
        this.dropDownOpen = false;

        this.selectVariable = this.selectVariable.bind(this);
        this.selectGraphicsMethod = this.selectGraphicsMethod.bind(this);
        this.plot = this.plot.bind(this);
        this.clear = this.clear.bind(this);

        this.callApi = this.callApi.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.auto = this.auto.bind(this);
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
    }
    base_url: string;
    dropDownOpen: boolean;
    vcs: any;
    canvas: any;

    componentDidMount() {
        // get variable information from the backend
        console.log('mounted VCSComponentLeft');
        let url = base_url + `/get_vars?file_path=${this.state.file_path}`;
        console.log(`sending request to ${url}`);
        this.callApi(url).then(res => {
            console.log('got vars ' + res.variables);
            this.setState({
                vars: res.variables
            });
        }).catch(err => {
            console.log(err);
        });

        // setup the global vcs.js object
        let script = document.createElement('script');
        script.src = `http://localhost:${vcs_port}/vcs.js`;
        script.async = true;
        script.addEventListener('load', this.handleScriptLoad);
        document.body.appendChild(script);
        debugger;
    }
    handleScriptLoad(){
        console.log('vcs.js load complete');
        debugger;
        let vcs_target = $('#vcs-viewer-main-div')[0];
        this.canvas = vcs.init(vcs_target);
    }

    plot(){
        this.props.plot(
            this.state.file_path, 
            this.state.graphicsmethod, 
            this.state.selected_var)
    }
    clear(){
        this.props.clear();
    }

    componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(this.props.file_path) !== JSON.stringify(nextProps.file_path)) {
            this.setState({
                file_path: nextProps.file_path
            })
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

    selectVariable(event: any): any {
        let variable = event.target.innerHTML;
        console.log(`user selected ${variable}`);
        this.setState({
            selected_var: variable
        });
        this.props.selectVariable(variable);
    }

    selectGraphicsMethod(event: any): any {
        let gm = event.target.innerHTML;
        console.log(`user selected ${gm}`);
        this.setState({
            graphicsmethod: gm
        });
        this.props.selectGm(gm);
    }
    toggleDropdown() {
        this.dropDownOpen = !this.dropDownOpen
    }
    auto(){
        this.props.clear();
        this.setState({
            selected_var: this.state.vars[0],
            graphicsmethod: 'isofill'
        });
        this.props.selectVariable(this.state.vars[0]);
        this.props.selectGm('isofill');
        this.props.plot();
    }
    render() {
        // let style = {
        //     padding: '1em'
        // };
        return (
            <div /*style={style}*/ className="jp-vcsConfig">
                <h1>vcs config</h1>
                <p>selected file: {this.state.file_path}</p>
                
                <div>
                    <p>selected variable: {this.state.selected_var}</p>
                    <ul>
                        {this.state.vars.map((item: string) => {
                            return (
                                <li key={item}>
                                    <button onClick={this.selectVariable}>{item}</button>
                                </li>);
                        })}
                    </ul>
                </div>
                <div>
                    <p>graphics method: {this.state.graphicsmethod}</p>
                    <ul>
                        {this.state.gms.map((item: string) => {
                            return (
                                <li key={item}>
                                    <button onClick={this.selectGraphicsMethod}>{item}</button>
                                </li>);
                        })}
                    </ul>
                </div>
                
                <button onClick={this.plot}>plot</button>
                <button onClick={this.clear}>clear</button>
                <button onClick={this.auto}>auto</button>
                <button onClick={() => {debugger}}> vcs </button>
            </div>
        )
    }
}
