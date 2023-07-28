import LinesNumeratorRenderer from "../linesNumerator/linesNumeratorRenderer";
import "./line.css";

export default class LinesRenderer {
    private container: Element;
    private lines: SingleLineRenderer[] = [];
    private linesNumerator = new LinesNumeratorRenderer();

    constructor(
        private root: Element
    ) {
        this.container = this.createLinesContainer();
        this.root.append(this.container);
    }

    public getLastLineIndex() {
        return this.lines.length - 1;
    }

    public getLineLength(lineIndex: number) {
        return this.lines[lineIndex]?.getTextContent().length || 0;
    }

    public getLineContent(lineIndex: number) {
        return this.lines[lineIndex]?.getTextContent() || '';
    }

    public setLineContent(content: string, lineIndex: number) {
        const line = this.lines[lineIndex];
        line ? line.updateTextContent(content): this.addLine(content, lineIndex);
    }

    public addLine(content: string, lineIndex: number) {
        const line = new SingleLineRenderer(this.container, content, lineIndex);
        this.lines.splice(lineIndex, 0, line);
        this.linesNumerator.increment();
    }

    public deleteLine(lineIndex: number) {
        this.lines[lineIndex]?.remove();
        this.lines.splice(lineIndex, 1);
        this.linesNumerator.decrement();
    }

    private createLinesContainer() {
        const container = document.createElement('div');
        container.className = 'TextEditor__linesContainer';
        return container;
    }
}

class SingleLineRenderer {
    private element;

    constructor(
        private root: Element,
        private textContent: string,
        lineIndex: number
    ) {
        this.element = this.createLineElement();

        if (this.root.childNodes.length == 0) {
            this.root.appendChild(this.element);
        } else {
            this.root.insertBefore(
                this.element,
                this.root.childNodes[lineIndex]
            );
        }
    }

    public setSelection(start: number, end: number) {
        const textNode = this.element.childNodes[0];
        const range = new Range();
        range.setStart(textNode, start);
        range.setEnd(textNode, end);
        document.getSelection()?.removeAllRanges();
        document.getSelection()?.addRange(range);
    }

    public remove() {
        this.root.removeChild(this.element);
    }

    public getTextContent() {
        return this.textContent;
    }

    public updateTextContent(textContent: string) {
        this.textContent = textContent;
        this.element.textContent = textContent + ' ';
    }

    private createLineElement() {
        const element = document.createElement('pre');
        element.className = 'TextEditor__line';
        element.innerText = this.textContent + ' ';
        return element;
    }
}
