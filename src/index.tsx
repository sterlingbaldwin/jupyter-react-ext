import {
    JupyterLab,
    JupyterLabPlugin
} from '@jupyterlab/application';

import { 
    DocumentRegistry 
} from '@jupyterlab/docregistry';

const FILETYPE = 'NetCDF';

import * as factories from './factories'


const plugin: JupyterLabPlugin<void> = {
    id: 'jupyter-vcs',
    autoStart: true,
    requires: [],
    activate: activate
};


export default plugin;


function activate(app: JupyterLab) {
    // Declare a widget variable
    console.log('starting activate for vcs plugin');

    const factory = new factories.NCViewerFactory({
        name: FILETYPE,
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
    })
}
