import * as React from 'react';


export class VCSViewer extends React.Component<any, any> {
    script: HTMLScriptElement;
    div: HTMLDivElement;
    canvas: any;
    src: string;
    constructor(props: any){
        super(props);
        this.div = (React as any).createRef();

    }
    render(){
        let style = {
            padding: '1em'
        };
        return (
            <div style={style}>
                <p>VCS Viewer</p>
                <div ref={div => {this.div = div}} id="vcs-viewer-main-div">
                </div>
            </div>
        );
    }
}
