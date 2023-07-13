import CursorRenderer, { TCursorCoordinates, TCursorPosition } from "../cursor/cursorRenderer";
import LineRenderer from "../line/lineRenderer";
import LinesNumeratorRenderer from "../linesNumerator/linesNumeratorRenderer";
import "./textEditor.css";

export default class TextEditorRenderer {
    private root: HTMLElement;
    private lines: Element;
    private cursor: CursorRenderer;
    private lineNumbers;

    constructor() {
        this.root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
        this.lines = this.initLines();
        this.lineNumbers = new LinesNumeratorRenderer()
        this.cursor = new CursorRenderer();

        this.root.appendChild(
            this.cursor.getElement()
        );
        this.root.appendChild(this.lines);

        this.createLine('Hello, world!');
        this.attachEvents();
    }

    private initLines() {
        const lines = document.createElement('div');
        lines.className = 'TextEditor__lines-container';
        return lines;
    }

    private attachEvents() {
        document.addEventListener('mousedown', (e) => this.cursor.handleMouseDown(e));
        document.addEventListener('mouseup',   (e) => this.cursor.handleMouseUp(e));
        document.addEventListener('mousemove', (e) => this.cursor.handleMouseMove(e));
        document.addEventListener('keydown',  (e) => this.handleKeypress(e));
    }

    private handleKeypress(e: KeyboardEvent) {
        e.preventDefault();

        console.log(e.code)

        switch (e.key) {
            case 'Enter': {
                this.createLine('');
            } break;

            case 'Backspace': {
                this.deleteChar(this.cursor.getPosition());
                this.cursor.shiftLeftInLine(
                    this.getCurrentLine(),
                    1
                )
            } break;

            case 'ArrowRight': {
                this.cursor.shiftRightInLine(
                    this.getCurrentLine(),
                    1
                )
            } break;

            case 'ArrowLeft': {
                this.cursor.shiftLeftInLine(
                    this.getCurrentLine(),
                    1
                )
            } break;

            case 'Shift': break;

            default: {
                console.log(e)
                this.insertChar(
                    this.cursor.getPosition(),
                    e.key
                );
                this.cursor.shiftRightInLine(
                    this.getCurrentLine(),
                    1
                );
            }
        }
    }

    private deleteChar(at: TCursorPosition) {
        const line = this.lines.children.item(at.line) as Element; // TODO: DRY
        line.textContent = (line.textContent?.slice(0, at.col-1) || '') + line.textContent?.slice(at.col);
    }

    private insertChar(
        at: TCursorPosition,
        char: string
    ) {
        const line = this.lines.children.item(at.line) as Element;
        line.textContent = line.textContent?.slice(0, at.col) + char + line.textContent?.slice(at.col);
    }

    private getCurrentLine() {
        return this.lines.childNodes.item(
            this.lineNumbers.getLastLineNumber()-1
        );
    }

    private createLine(content: string) {
        const line = new LineRenderer(content);

        this.lineNumbers.increment();
        this.lines.appendChild(
            line.getElement()
        );
    }
}
