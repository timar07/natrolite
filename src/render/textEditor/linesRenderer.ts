import LinesNumeratorRenderer from "../linesNumerator/linesNumeratorRenderer";
import LineRenderer from "../line/lineRenderer";

export default class LinesRenderer {
    private root: Element;
    private lineNumbers;
    private lines: LineRenderer[];

    constructor(parent: Element) {
        this.root = this.createLinesContainer();
        this.lineNumbers = new LinesNumeratorRenderer()
        this.lines = [];

        parent.appendChild(this.root);
    }

    public getRect(line: number, col: number): DOMRect {
        return this.lines[line].getRectByCol(col);
    }

    public createLine(content: string) {
        const line = new LineRenderer(this.root, content);

        this.lines.push(line);
        this.lineNumbers.increment();
    }

    public getLineTextContent(n: number) {
        return this.lines[n].getContent();
    }

    public setLineTextContent(n: number, content: string) {
        this.lines[n].setContent(content);
    }

    private createLinesContainer() {
        const lines = document.createElement('div');
        lines.className = 'TextEditor__linesContainer';
        return lines;
    }
}