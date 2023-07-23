import { TEditorPosition } from "../editor/editor";
import LinesNumeratorRenderer from "../linesNumerator/linesNumeratorRenderer";
import "./line.css";

interface ILineEditingStrategy {
    edit(pos: TEditorPosition, text: string): string;
}

export class Insert implements ILineEditingStrategy {
    constructor(
        private char: string
    ) {}

    edit(pos: TEditorPosition, text: string) {
        return text.slice(0, pos.col) + this.char + text.slice(pos.col);
    }
}

export class Delete implements ILineEditingStrategy {
    constructor() {}

    edit(pos: TEditorPosition, text: string) {
        return text.slice(0, pos.col-1) + text.slice(pos.col);
    }
}

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

    public getLineLength(line: number) {
        return this.lines[line].getTextContent().length
    }

    public addLine(content: string, at: TEditorPosition) {
        const line = new SingleLineRenderer(this.container, content, at.line);
        this.lines.splice(at.line, 0, line);
        this.linesNumerator.increment();
    }

    public deleteLine(at: TEditorPosition) {
        this.lines[at.line].remove();
        this.lines.splice(at.line, 1);
        this.linesNumerator.decrement();
    }

    public edit(
        pos: TEditorPosition,
        strategy: ILineEditingStrategy
    ) {
        const line = this.lines[pos.line];
        line.updateTextContent(strategy.edit(pos, line.getTextContent()));
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
