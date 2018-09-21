import {
    JupyterLab,
    JupyterLabPlugin
} from '@jupyterlab/application';

import {
    ABCWidgetFactory,
    DocumentRegistry,
    IDocumentWidget,
    DocumentWidget
} from '@jupyterlab/docregistry';

import {
    CommandRegistry
} from '@phosphor/commands';

import { Widget } from '@phosphor/widgets';

const FILETYPE = 'NetCDF';

// import * as factories from './factories'

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import { VCSComponentLeft } from './components'

let commands: CommandRegistry;

const plugin: JupyterLabPlugin<void> = {
    id: 'jupyterlab-vcs',
    autoStart: true,
    requires: [],
    activate: activate
};


export default plugin;


function activate(app: JupyterLab) {
    // Declare a widget variable
    console.log('starting activate for vcs plugin');
    commands = app.commands;

    const factory = new NCViewerFactory({
        name: 'vcs',
        fileTypes: [FILETYPE],
        defaultFor: [FILETYPE],
        readOnly: true
    });

    let ft: DocumentRegistry.IFileType = {
        name: FILETYPE,
        extensions: ['.nc'],
        mimeTypes: ['application/netcdf'],
        contentType: 'file',
        fileFormat: 'base64'
    }

    app.docRegistry.addFileType(ft);
    app.docRegistry.addWidgetFactory(factory);

    factory.widgetCreated.connect((sender, widget) => {
        console.log('NCViewerWidget created from factory');
    });


    let widget = new NCSetupWidget();
    console.log('Widget after constructor');
    widget.update();

    if (!widget.isAttached) {
        // Attach the widget to the left area if it's not there
        app.shell.addToLeftArea(widget);
    } else {
        widget.update();
    }
    // Activate the widget
    app.shell.activateById(widget.id);
}

export class NCViewerFactory extends ABCWidgetFactory<
    IDocumentWidget<NCViewerWidget>
    > {
    /**
     * Create a new widget given a context.
     */
    protected createNewWidget(
        context: DocumentRegistry.Context
    ): IDocumentWidget<NCViewerWidget> {
        const content = new NCViewerWidget(context);
        const ncWidget = new DocumentWidget({ content, context });

        console.log('executing command console:create');
        commands.execute('console:create', {
            activate: true,
            path: context.path,
            preferredLanguage: context.model.defaultKernelLanguage
        }).then(consolePanel => {
            consolePanel.session.ready.then(() => {
                consolePanel.console.inject('import cdms2');
                consolePanel.console.inject('import vcs');
                consolePanel.console.inject('x=vcs.init()');
                consolePanel.console.inject('x.plot([1,2,3,4,5,6])');
            });
        });
        return ncWidget;
    }
}


export class NCViewerWidget extends Widget {
    constructor(context: DocumentRegistry.Context) {
        super();
        this.context = context;
    }


    readonly context: DocumentRegistry.Context;

    readonly ready = Promise.resolve(void 0);
}

export class NCSetupWidget extends Widget {
    constructor(){
        super();
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
}
