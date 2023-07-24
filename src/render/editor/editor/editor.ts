import Cursor from "../cursor/cursor";
import { IMoveOperation } from "../cursor/cursorOperations";
import { EditorCommands } from "./editorCommands";
import EditorRenderer from "./editorRenderer";

export type TEditorPosition = {
    line: number,
    col: number
};

export interface ICommand<T> {
    execute(receiver: T): void;
    undo(): void;
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
        this.view.addLine('', this.editorPosition);
    }

    public resetSelection() {
        document.getSelection()?.removeAllRanges();
    }

    public insertChar(char: string) {
        this.view.insertCharAt(this.editorPosition, char)
    }

    public deleteChar() {
        this.view.deleteCharAt(this.editorPosition);
    }

    public deleteLine() {
        this.view.deleteLine(this.editorPosition);
    }

    public addLine(content: string, at: TEditorPosition) {
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

    private handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        if (event.shiftKey) {
            this.getShiftOperation(event.key)?.execute(this);
            return;
        }

        this.getSimpleOperation(event.key)?.execute(this);
    }

    private getShiftOperation(key: string) {
        switch (key) {
        }

        if (this.isPrintableChar(key)) {
            return new EditorCommands.InsertChar(key.toString());
        }
    }

    private getSimpleOperation(key: string) {
        switch (key) {
            case 'Backspace':
                return new EditorCommands.Backspace();
            case 'ArrowLeft':
                return new EditorCommands.ArrowLeft();
            case 'ArrowRight':
                return new EditorCommands.ArrowRight();
            case 'ArrowDown':
                return new EditorCommands.ArrowDown();
            case 'ArrowUp':
                return new EditorCommands.ArrowUp();
            case 'Enter':
                return new EditorCommands.Enter();
            case 'Tab':
                return new EditorCommands.Tab();
        }

        if (this.isPrintableChar(key)) {
            return new EditorCommands.InsertChar(key.toString());
        }
    }

    private isPrintableChar(key: string) {
        return key.length == 1;
    }

    public getPosition(): TEditorPosition {
        const relativeRect = this.getRelativeCursorRect();
        return {
            line: relativeRect.top / relativeRect.height,
            col: relativeRect.left / relativeRect.width
        }
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
