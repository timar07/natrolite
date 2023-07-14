import CursorRenderer, { TCursorPosition } from "../cursor/cursorRenderer";
import { IKeyboardKey, UserEvents } from "../userEvents";
import LinesRenderer from "./linesRenderer";
import "./textEditor.css";

export default class TextEditorRenderer {
    private root: HTMLElement;
    private cursor: CursorRenderer;
    private lines: LinesRenderer;
    private userEvents;

    constructor() {
        this.root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
        this.cursor = new CursorRenderer();
        this.userEvents = new UserEvents();
        this.lines = new LinesRenderer(this.root);

        this.root.appendChild(
            this.cursor.getElement()
        );

        this.attachEvents();
        this.lines.createLine('Hello, world!');
    }

    private attachEvents() {
        document.addEventListener('mousedown', (e) => this.cursor.handleMouseDown(e));
        document.addEventListener('mouseup',   (e) => this.cursor.handleMouseUp(e));
        document.addEventListener('mousemove', (e) => this.cursor.handleMouseMove(e));
        this.userEvents.onKeyPress = this.handleKeypress.bind(this);
    }

    private handleKeypress(key: IKeyboardKey) {
        let strategy: IEditingStrategy;
        const pos = this.cursor.getPosition();

        strategy = key.isPrintable()
            ? new TypingStrategy(
                this.lines.getLineTextContent(pos.line),
                pos,
                key.toString()
            )
            : new BackspaceStrategy(
                this.lines.getLineTextContent(pos.line),
                pos
            );

        this.lines.setLineTextContent(pos.line, strategy.getText());

        this.cursor.setToRect(
            this.lines.getRect(
                pos.line,
                pos.col
            ),
            strategy.getCurrentPosition()
        );
    }
}

interface IEditingStrategy {
    getText(): string;
    getCurrentPosition(): TCursorPosition;
}

class BackspaceStrategy implements IEditingStrategy {
    constructor(
        private lineText: string,
        private at: TCursorPosition
    ) {
    }

    getCurrentPosition(): TCursorPosition {
        return {
            col: this.at.col-1, // shift cursor left
            line: this.at.line,
        }
    }

    getText(): string {
        console.log(this.lineText.slice(0, this.at.col-1), this.lineText.slice(this.at.col))
        return (this.lineText.slice(0, this.at.col-1) || '') + this.lineText.slice(this.at.col);
    }
}

class TypingStrategy implements IEditingStrategy {
    constructor(
        private lineText: string,
        private at: TCursorPosition,
        private text: string
    ) {
    }
    getCurrentPosition(): TCursorPosition {
        return {
            col: this.at.col+this.text.length, // shift cursor right
            line: this.at.line,
        }
    }

    getText(): string {
        return (this.lineText.slice(0, this.at.col) || '') + this.text + this.lineText.slice(this.at.col);
    }
}
