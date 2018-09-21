import { Widget } from '@phosphor/widgets';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import { VCSComponentLeft } from './components'

export class NCSetupWidget extends Widget {
    constructor(){
        super();
        this.div = document.createElement('div');
        this.div.id = 'vcs-component';
        this.node.appendChild(this.div);
        console.log('firing NCViewerWidget constructor');

        let props = {
            var_name: '',
            file_path: '',
            thing: 'WORLD'
        };
        ReactDOM.render(
            <VCSComponentLeft {...props} className="p-Widget p-StackedPanel" ></VCSComponentLeft>,
            this.div)
    }
    div: HTMLDivElement;
}
