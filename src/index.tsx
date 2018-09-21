import {
    JupyterLab,
    JupyterLabPlugin,
    ApplicationShell
} from '@jupyterlab/application';

import {
    ABCWidgetFactory,
    DocumentRegistry,
    IDocumentWidget,
    DocumentWidget
} from '@jupyterlab/docregistry';

import { 
    ICommandPalette
} from '@jupyterlab/apputils';

import {
    CommandRegistry
} from '@phosphor/commands';

import { 
    Widget 
} from '@phosphor/widgets';

const FILETYPE = 'NetCDF';
const FACTORY_NAME = 'vcs';

import * as widgets from './widgets'

let commands: CommandRegistry;
let shell: ApplicationShell;
let widget: widgets.NCSetupWidget;

const plugin: JupyterLabPlugin<void> = {
    id: 'jupyterlab-vcs',
    autoStart: true,
    requires: [ICommandPalette],
    activate: activate
};

export default plugin;

function activate(app: JupyterLab, palette: ICommandPalette) {
    // Declare a widget variable
    console.log('starting activate for vcs plugin');
    commands = app.commands;
    shell = app.shell;

    const factory = new NCViewerFactory({
        name: FACTORY_NAME,
        fileTypes: [FILETYPE],
        defaultFor: [FILETYPE],
        modelName: 'base64',
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

    const command: string = 'vcs:open-setup';
    commands.addCommand(command, {
        label: 'VCS Setup',
        execute: () => {
            if(!widget){
                widget = new widgets.NCSetupWidget();
                widget.id = 'vcs-setup';
                widget.title.label = 'VCS Setup';
                widget.title.closable = true;
            }
            if (!widget.isAttached) {
                // Attach the widget to the left area if it's not there
                app.shell.addToLeftArea(widget);
            } else {
                widget.update();
            }
            // Activate the widget
            app.shell.activateById(widget.id);
        }
    });

    palette.addItem({ command, category: 'Visualization' });

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
        debugger;
        const path = context.session.path;
        if(!widget){
            widget = new widgets.NCSetupWidget();
            widget.id = 'vcs-setup';
            widget.title.label = 'vcs';
            widget.title.closable = true;
        }
        if (!widget.isAttached) {
            // Attach the widget to the left area if it's not there
            shell.addToLeftArea(widget);
        } else {
            widget.update();
        }
        // Activate the widget
        shell.activateById(widget.id);

        console.log('executing command console:create');
        commands.execute('console:create', {
            activate: true,
            path: context.path,
            preferredLanguage: context.model.defaultKernelLanguage
        }).then(consolePanel => {
            consolePanel.session.ready.then(() => {
                consolePanel.console.inject('import cdms2');
                consolePanel.console.inject('import vcs');
                consolePanel.console.inject(`data = cdms2.open('${path}')`);
                consolePanel.console.inject('clt = data("clt")');
                consolePanel.console.inject('x=vcs.init()');
                consolePanel.console.inject('x.plot(clt)');
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
