import Cursor from "../cursor/cursor";
import { CursorOperations, IMoveOperation } from "../cursor/cursorOperations";
import EditorRenderer from "./editorRenderer";

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

    public handleCursorOperation(operation: IMoveOperation) {
        operation.execute(this.cursor);
    }

    public getCurrentLineLength() {
        return this.view.getLineLength(this.editorPosition.line);
    }

    public getLineLength(line: number) {
        return this.view.getLineLength(line)
    }

    private handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        this.getEditorOperation(event.key)?.execute(this);
    }

    private getEditorOperation(key: string) {
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
            case 'Tab':
                return new Tab();
        }

        if (this.isPrintableChar(key)) {
            return new InsertChar(key.toString());
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
        receiver.handleCursorOperation(new CursorOperations.MoveRight());
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
            receiver.handleCursorOperation(new CursorOperations.MoveUp());
            receiver.handleCursorOperation(new CursorOperations.MoveRight(
                receiver.getCurrentLineLength()
            ));
            return;
        }

        receiver.deleteChar();
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class Enter implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.addLine('');
        receiver.handleCursorOperation(new CursorOperations.CarriageReturn());
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class Tab implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.insertChar(' '.repeat(4));
        receiver.handleCursorOperation(new CursorOperations.MoveRight(4));
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowUp implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.handleCursorOperation(new CursorOperations.MoveUp());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowDown implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowRight implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().col >= receiver.getCurrentLineLength())
            return;

        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class ArrowLeft implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().col == 0) return;
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class NoOperation implements IEditorCommand {
    execute(receiver: EditorFacade): void {}
    undo(): void {}
}
