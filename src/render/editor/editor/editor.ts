import Cursor from "../cursor/cursor";
import { IMoveOperation } from "../cursor/cursorOperations";
import { EditorKeyboardHandler } from "./editorKeyboard";
import EditorRenderer from "./editorRenderer";

export type TEditorPosition = {
    line: number,
    col: number
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
    private editorPosition: TEditorPosition = {
        line: 0,
        col: 0
    };

    constructor() {
        this.cursor.onUpdate = () => {
            this.editorPosition = this.getPosition();
        };

        document.onkeydown = this.handleKeyPress.bind(this);
        this.view.addLine('', this.editorPosition.line);
    }

    public resetSelection() {
        document.getSelection()?.removeAllRanges();
    }

    public insertString(char: string) {
        this.view.insertCharAt(this.editorPosition, char)
    }

    public deleteChar() {
        this.view.deleteCharAt(this.editorPosition);
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
        return this.view.getLineLength(this.editorPosition.line);
    }

    public getLineLength(line: number) {
        return this.view.getLineLength(line)
    }

    public getLineContent(line: number) {
        return this.view.getLineContents(line);
    }

    public setLineContent(content: string, line: number) {
        return this.view.setLineContent(content, line);
    }

    public getPosition(): TEditorPosition {
        const relativeRect = this.getRelativeCursorRect();
        return {
            line: relativeRect.top / relativeRect.height,
            col: relativeRect.left / relativeRect.width
        }
    }

    private handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        new EditorKeyboardHandler().getCommand(event)?.execute(this);
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
