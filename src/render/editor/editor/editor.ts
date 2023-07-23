import Cursor from "../cursor/cursor";
import EditorRenderer from "./editorRenderer";
import { CursorOperation } from "../cursor/cursorOperations";

export type TEditorPosition = {
    line: number,
    col: number
};

export default class Editor {
    private view = new EditorRenderer();
    private cursor = new Cursor(
        new DOMRect(100, 50, 8, 16.5) // FIXME: Hardcoded
    );
    private editorPosition: TEditorPosition = {
        line: 0,
        col: 0
    };

    constructor() {
        this.cursor.onUpdate = () => {
            this.editorPosition = this.getCursorPosition();
        };

        document.onkeydown = this.handleKeyPress.bind(this);
        this.view.addLine('', this.editorPosition);
    }

    private handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();

        switch (event.key) {
            case 'Shift': return;
            case 'Backspace': {
                if (this.editorPosition.col <= 0) {
                    if (this.editorPosition.line == 0) return;
                    this.view.deleteLine(this.editorPosition);
                    this.cursor.handleOperation(CursorOperation.moveUp);
                    this.cursor.handleOperation(CursorOperation.moveEndOfLine);
                    return;
                }

                this.view.deleteCharAt(
                    this.getCursorPosition()
                );

                this.cursor.handleOperation(CursorOperation.moveLeft);
            } break;
            case 'ArrowLeft': {
                if (this.editorPosition.col == 0) return;
                this.cursor.handleOperation(CursorOperation.moveLeft);
            } break;
            case 'ArrowRight': {
                this.cursor.handleOperation(CursorOperation.moveRight);
            } break;
            case 'ArrowDown': {
                this.cursor.handleOperation(CursorOperation.moveDown);
            } break;
            case 'ArrowUp': {
                this.cursor.handleOperation(CursorOperation.moveUp);
            } break;
            case 'Enter': {
                this.view.addLine('', {
                    line: this.editorPosition.line+1,
                    col: this.editorPosition.col
                });
                this.cursor.handleOperation(CursorOperation.carriageReturn);
                this.cursor.handleOperation(CursorOperation.moveDown);
            } break;
            default: {
                this.view.insertCharAt(
                    this.getCursorPosition(),
                    event.key.toString()
                );

                this.cursor.handleOperation(CursorOperation.moveRight);
            }
        }
    }

    private getCursorPosition(): TEditorPosition {
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

interface IEditorCommand {
    execute(receiver: Editor): void;
    undo(): void;
}
