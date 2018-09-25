import * as React from 'react';

// import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

export class VCSComponentLeft extends React.Component<any, any> {

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
        this.props = props;
        this.base_url = '/vcs';
        this.dropDownOpen = false;

        this.selectVariable = this.selectVariable.bind(this);
        this.selectGraphicsMethod = this.selectGraphicsMethod.bind(this);
        this.plot = this.plot.bind(this);
        this.clear = this.clear.bind(this);

        this.callApi = this.callApi.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.auto = this.auto.bind(this);
    }
    base_url: string;
    dropDownOpen: boolean;

    componentDidMount() {
        console.log('mounted VCSComponentLeft');
        let url = this.base_url + `/get_vars?file_path=${this.state.file_path}`;
        console.log(`sending request to ${url}`);
        this.callApi(url).then(res => {
            console.log('got vars ' + res.variables);
            this.setState({
                vars: res.variables
            });
        }).catch(err => {
            console.log(err);
        });
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
        let style = {
            padding: '1em'
        };
        return (
            <div style={style}>
                <h1>vcs config</h1>
                <p>selected file: {this.state.file_path}</p>
                
                <div>
                    <p>selected variable: {this.state.selected_var}</p>
                    <ul>
                        {this.state.vars.map((item: string) => {
                            return <li><button onClick={this.selectVariable}>{item}</button></li>
                        })}
                    </ul>
                </div>
                <div>
                    <p>graphics method: {this.state.graphicsmethod}</p>
                    <ul>
                        {this.state.gms.map((item: string) => {
                            return <li><button onClick={this.selectGraphicsMethod}>{item}</button></li>
                        })}
                    </ul>
                </div>
                
                <button onClick={this.plot}>plot</button>
                <button onClick={this.clear}>clear</button>
                <button onClick={this.auto}>auto</button>
            </div>
        )
    }
}
