import { CursorOperations } from "../cursor/cursorOperations";
import EditorFacade, { ICommand } from "./editor";

interface IEditorCommand extends ICommand<EditorFacade> {}

export namespace EditorCommands {

export class InsertChar implements IEditorCommand {
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

export class Backspace implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (this.isLineEmpty(receiver)) {
            if (!this.isLinesLeft(receiver)) return;
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

    private isLineEmpty(receiver: EditorFacade) {
        return receiver.getPosition().col <= 0
    }

    private isLinesLeft(receiver: EditorFacade) {
        return receiver.getPosition().line > 0
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class Enter implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.addLine('');
        receiver.handleCursorOperation(new CursorOperations.CarriageReturn());
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class Tab implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.insertChar(' '.repeat(4));
        receiver.handleCursorOperation(new CursorOperations.MoveRight(4));
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class ArrowUp implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().line == 0) return;
        receiver.handleCursorOperation(new CursorOperations.MoveUp());
        this.normalizeHorizontalPosition(receiver);
    }

    // Prevents the cursor from being in a non-existing position
    private normalizeHorizontalPosition(receiver: EditorFacade) {
        if (!this.isOutOfLine(receiver)) return;

        receiver.handleCursorOperation(
            new CursorOperations.MoveLeft(this.getOverflow(receiver))
        );
    }

    private isOutOfLine(receiver: EditorFacade) {
        return receiver.getCurrentLineLength() < receiver.getPosition().col
    }

    private getOverflow(receiver: EditorFacade) {
        return receiver.getPosition().col - receiver.getCurrentLineLength()
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class ArrowDown implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().line == receiver.getLastLineIndex())
            return;
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class ArrowRight implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.resetSelection();
        if (receiver.getPosition().col >= receiver.getCurrentLineLength())
            return;

        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class ArrowLeft implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        receiver.resetSelection();
        if (receiver.getPosition().col == 0) return;
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class NoOperation implements IEditorCommand {
    execute(receiver: EditorFacade): void {}
    undo(): void {}
}

}
