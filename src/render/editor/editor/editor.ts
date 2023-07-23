import Cursor from "../cursor/cursor";
import EditorRenderer from "./editorRenderer";
import { CursorOperation } from "../cursor/cursorOperations";

export type TEditorPosition = {
    line: number,
    col: number
};

export default class EditorFacade {
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
            this.editorPosition = this.getPosition();
        };

        document.onkeydown = this.handleKeyPress.bind(this);
        this.view.addLine('', this.editorPosition);
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

    public addLine(content: string) {
        this.view.addLine(content, {
            line: this.getPosition().line+1,
            col: this.getPosition().col
        });
    }

    public handleCursorOperation(operation: CursorOperation) {
        this.cursor.handleOperation(operation);
    }

    public getCurrentLineLength() {
        return this.view.getLineLength(this.editorPosition);
    }

    private handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        this.getEditorOperation(event.key).execute(this);
    }

    private getEditorOperation(key: string): IEditorCommand {
        switch (key) {
            case 'Shift':
                return new NoOperation();
            case 'Backspace':
                return new Backspace();
            case 'ArrowLeft':
                return new ArrowLeft();
            case 'ArrowRight':
                return new ArrowRight();
            case 'ArrowDown':
                return new ArrowDown();
            case 'ArrowUp':
                return new ArrowUp();
            case 'Enter':
                return new Enter();
            default:
                return new InsertChar(key.toString());
        }
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

export interface ICommand<T> {
    execute(receiver: T): void;
    undo(): void;
}

interface IEditorCommand extends ICommand<EditorFacade> {}

class InsertChar implements IEditorCommand {
    constructor(
        private char: string
    ) {}

    execute(receiver: EditorFacade): void {
        receiver.insertChar(this.char);
        receiver.handleCursorOperation(CursorOperation.moveRight);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class Backspace implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().col <= 0) {
            if (receiver.getPosition().line == 0)
                return;

            receiver.deleteLine();
            receiver.handleCursorOperation(CursorOperation.moveUp);
            receiver.handleCursorOperation(CursorOperation.moveEndOfLine);
            return;
        }

        receiver.deleteChar();
        receiver.handleCursorOperation(CursorOperation.moveLeft);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class Enter implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.addLine('');
        receiver.handleCursorOperation(CursorOperation.carriageReturn);
        receiver.handleCursorOperation(CursorOperation.moveDown);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowUp implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.handleCursorOperation(CursorOperation.moveUp);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowDown implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.handleCursorOperation(CursorOperation.moveDown);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowRight implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().col >= receiver.getCurrentLineLength())
            return;

        receiver.handleCursorOperation(CursorOperation.moveRight);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowLeft implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().col == 0) return;
        receiver.handleCursorOperation(CursorOperation.moveLeft);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class NoOperation implements IEditorCommand {
    execute(receiver: EditorFacade): void {}
    undo(): void {}
}
