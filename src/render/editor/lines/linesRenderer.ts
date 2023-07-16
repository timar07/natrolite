import { TEditorPosition } from "../editor/editor";
import LinesNumeratorRenderer from "../linesNumerator/linesNumeratorRenderer";
import "./line.css";

export default class LinesRenderer {
    private container: Element;
    private lines: LineRenderer[] = [];
    private linesNumerator = new LinesNumeratorRenderer();

    constructor(
        private root: Element
    ) {
        this.container = this.createLinesContainer();
        this.root.append(this.container);
    }

    private createLinesContainer() {
        const container = document.createElement('div');
        container.className = 'TextEditor__linesContainer';
        return container;
    }

    public addLine(content: string, at: TEditorPosition) {
        const line = new LineRenderer(this.container, content, at.line);
        this.lines.splice(at.line, 0, line);
        this.linesNumerator.increment();
    }

    public deleteLine(at: TEditorPosition) {
        this.lines[at.line].remove();
        this.lines.splice(at.line, 1);
        this.linesNumerator.decrement();
    }

    // TODO: Cleanup here
    public insertCharAt(pos: TEditorPosition, char: string) {
        const line = this.lines[pos.line];
        const textContent = line.getTextContent();
        const newTextContent = textContent.slice(0, pos.col) + char + textContent.slice(pos.col);
        line.updateTextContent(newTextContent);
    }

    public deleteCharAt(pos: TEditorPosition) {
        const line = this.lines[pos.line];
        const textContent = line.getTextContent();
        const newTextContent = textContent.slice(0, pos.col-1) + textContent.slice(pos.col);
        line.updateTextContent(newTextContent);
    }
}

class LineRenderer {
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
