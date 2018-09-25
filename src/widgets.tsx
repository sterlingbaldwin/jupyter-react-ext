import { Widget } from '@phosphor/widgets';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import { VCSComponentLeft } from './components'


export class NCSetupWidget extends Widget {
    constructor(file_path: string) {
        super();
        this.div = document.createElement('div');
        this.div.id = 'vcs-component';
        this.div.className = 'jp-vcsSetupWidget';
        this.node.appendChild(this.div);
        
        this.dirty = true;

        this.updatePath = this.updatePath.bind(this);
        this.plot = this.plot.bind(this);
        this.initConsole = this.initConsole.bind(this);
        this.selectVariable = this.selectVariable.bind(this);
        this.selectGm = this.selectGm.bind(this);
        this.clear = this.clear.bind(this);

        this.selected_variable = '';
        this.selected_gm = '';

        let props = {
            file_path: file_path,
            plot: this.plot,
            selectVariable: this.selectVariable,
            selectGm: this.selectGm,
            clear: this.clear
        };
        this.component = ReactDOM.render(
            <VCSComponentLeft {...props} />,
            this.div)
    }
    updatePath(new_path: string) {
        console.log(new_path);
        this.file_path = new_path;
        this.component.setState({
            file_path: new_path
        });
    }
    initConsole(){
        let script = [
            'import cdms2',
            'import vcs',
            'x = vcs.init()',
            'template = vcs.createtemplate()',
            `data = cdms2.open('${this.file_path}')`,
        ];
        script.forEach((item, idx) => {
            this.console.inject(item);
        });
    }
    selectVariable(variable: string){
        if(this.selected_variable != variable){
            this.dirty = true;
            this.selected_variable = variable;
            this.console.inject(`${variable} = data('${variable}')`)
        }
    }
    selectGm(gm: string){
        if(gm != this.selected_gm){
            this.dirty = true;
            this.selected_gm = gm;
            this.console.inject(`${gm} = vcs.create${gm}()`)
        }
    }
    plot(path: string, gm: string, variable: string) {
        this.console.inject(`x.plot(${this.selected_variable}, ${this.selected_gm}, template)`);
        this.dirty = false;
    }
    clear(){
        this.dirty = true;
        this.console.clear();
        this.initConsole();
        this.selected_variable = '';
        this.selected_gm = '';
    }
    div: HTMLDivElement;
    props: any;
    component: any;
    console: any;
    file_path: string;
    first_pass: boolean;
    selected_variable: string;
    selected_gm: string;
    dirty: boolean;
}
