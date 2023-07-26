import "./lineNumerator.css";

export default class LinesNumeratorRenderer {
    private container;
    private lastLineNumber = 0;

    constructor() {
        this.container = document.getElementsByClassName('TextEditor__linesNumbers')[0];
    }

    public getLastLineNumber() {
        return this.lastLineNumber;
    }

    public increment() {
        this.lastLineNumber++;
        this.container.appendChild(this.createLineElement());
    }

    public decrement() {
        this.lastLineNumber--;
        this.container.removeChild(
            this.container.childNodes[this.container.childNodes.length-1]
        );
    }

    private createLineElement() {
        const element = document.createElement('div');
        element.className = 'TextEditor__lineNumber';
        element.textContent = String(this.lastLineNumber) + ' ';
        return element;
    }
}