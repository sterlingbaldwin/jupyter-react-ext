import { Widget } from '@phosphor/widgets';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import { VCSComponentLeft } from './components'

/**
 * A widget for NC loaders.
 */
export class NCViewerWidget extends Widget {
    constructor(context: DocumentRegistry.Context) {
        super();
        this.context = context;
        this.div = document.createElement('div');
        this.div.id = 'vcs-component';
        this.node.appendChild(this.div);
        console.log('firing NCViewerWidget constructor');

        context.ready.then(() => {
            let props = {
                var_name: '',
                file_path: ''
            }
            ReactDOM.render(
                <VCSComponentLeft {...props} className="p-Widget p-StackedPanel" ></VCSComponentLeft>,
                this.div)
        });
    }
    // toolbar: Toolbar;
    div: HTMLDivElement;
    /**
     * The widget's context.
     */
    readonly context: DocumentRegistry.Context;

    readonly ready = Promise.resolve(void 0);
}