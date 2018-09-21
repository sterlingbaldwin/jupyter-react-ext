import {
    ABCWidgetFactory,
    DocumentRegistry,
    IDocumentWidget,
    DocumentWidget
} from '@jupyterlab/docregistry';

import {
    CommandRegistry
} from '@phosphor/commands';

import * as widgets from './widgets'

let commands: CommandRegistry;

export class NCViewerFactory extends ABCWidgetFactory<
    IDocumentWidget<widgets.NCViewerWidget>
    > {
    /**
     * Create a new widget given a context.
     */
    protected createNewWidget(
        context: DocumentRegistry.Context
    ): IDocumentWidget<widgets.NCViewerWidget> {
        const content = new widgets.NCViewerWidget(context);
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