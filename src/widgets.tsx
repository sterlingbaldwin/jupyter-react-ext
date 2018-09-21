import { Widget } from '@phosphor/widgets';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import { VCSComponentLeft } from './components'

export class NCViewerWidget extends Widget {
    constructor(context: DocumentRegistry.Context) {
        super();
        this.context = context;
        this.div = document.createElement('div');
        this.div.id = 'vcs-component';
        this.node.appendChild(this.div);
        console.log('firing NCViewerWidget constructor');

        let props = {
            var_name: '',
            file_path: ''
        }
        ReactDOM.render(
            <VCSComponentLeft {...props} className="p-Widget p-StackedPanel" ></VCSComponentLeft>,
            this.div)
    }

    div: HTMLDivElement;

    readonly context: DocumentRegistry.Context;

    readonly ready = Promise.resolve(void 0);
}