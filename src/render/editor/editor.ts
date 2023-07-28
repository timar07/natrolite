import Cursor from "./view/cursor/cursor";
import { IMoveOperation } from "./view/cursor/cursorOperations";
import { EditorKeyboardHandlerFactory } from "./editorKeyboard";
import EditorRenderer from "./editor/editorRenderer";
import { DocumentProcessor } from "./documentProcessor";
import { VisualPosition } from "./visualPosition";

export type TEditorPosition = {
    line: number,
    col: number,
    offset: number
};

export interface IPrimitiveCommand<T> {
    execute(receiver: T): void;
}

export interface ICommand<T> extends IPrimitiveCommand<T> {
    undo(receiver: T): void;
}

export default class EditorFacade {
    private view = new EditorRenderer();

    private cursor = new Cursor(
        this.view.getElement(),
        new DOMRect(100, 50, 8, 16.5) // FIXME: Hardcoded
    );

    private editorPosition = new VisualPosition(0, 0);
    private document = new DocumentProcessor();

    constructor() {
        this.cursor.onUpdate = () => {
            this.editorPosition = this.getPosition();
        };

        document.onkeydown = this.handleKeyPress.bind(this);
        this.view.addLine('', this.editorPosition.getLine());
        this.document.onChange = (ev) => this.view.renderChanges(ev);
    }

    public getDocument() {
        return this.document;
    }

    public resetSelection() {
        document.getSelection()?.removeAllRanges();
    }

    public editLine(line: number, strategy: LineEditingStrategy) {

    }

    public deleteLine(line: number) {
        this.view.deleteLine(line);
    }

    public addLine(content: string, at: number) {
        this.view.addLine(content, at);
    }

    public handleCursorOperation(operation: IMoveOperation) {
        operation.execute(this.cursor);
    }

    public getLastLineIndex() {
        return this.view.getLastLineIndex();
    }

    public getCurrentLineLength() {
        return this.view.getLineLength(this.editorPosition.getLine())
    }

    public getPosition(): VisualPosition {
        const relativeRect = this.getRelativeCursorRect();
        return new VisualPosition(
            (relativeRect.top + this.view.getElement().scrollTop) / relativeRect.height,
            relativeRect.left / relativeRect.width,
        );
    }

    private handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        new EditorKeyboardHandlerFactory(this).getCommand(event)?.execute(this);
    }

    private getRelativeCursorRect(): DOMRect {
        const editorRect = this.view.getWindowRect();
        const cursor = this.cursor.getCurrentRect();

        return new DOMRect(
            cursor.left - editorRect.left,
            cursor.top - editorRect.top,
            cursor.width,
            cursor.height
        );
    }
}

interface LineEditingStrategy {
    edit(pos: TEditorPosition, text: string): string;
}

export class Insert implements LineEditingStrategy {
    constructor(
        private char: string
    ) {}

    edit(pos: TEditorPosition, text: string) {
        return text.slice(0, pos.col) + this.char + text.slice(pos.col);
    }
}

export class Delete implements LineEditingStrategy {
    constructor() {}

    edit(pos: TEditorPosition, text: string) {
        return text.slice(0, pos.col-1) + text.slice(pos.col);
    }
}
