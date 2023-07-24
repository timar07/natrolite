import { CursorOperations } from "../../cursor/cursorOperations";
import EditorFacade, { ICommand } from "../editor";
import { IBackspaceStrategy } from "./backspace";
import { CursorMoveStrategy } from "./cursorMove";

export interface IEditorCommand extends ICommand<EditorFacade> {}

export namespace EditorCommands {

export class InsertChar implements IEditorCommand {
    constructor(
        private char: string
    ) {}

    execute(receiver: EditorFacade): void {
        receiver.insertChar(this.char);
        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
    }
}

export class Enter implements IEditorCommand {
    execute(receiver: EditorFacade): void {
        if (receiver.getPosition().col > 0) {
            receiver.addLine('', {
                line: receiver.getPosition().line+1,
                col: receiver.getPosition().col
            });
        } else {
            receiver.addLine('', {
                line: receiver.getPosition().line,
                col: receiver.getPosition().col
            });
        }
        receiver.handleCursorOperation(new CursorOperations.CarriageReturn());
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class Tab implements IEditorCommand {
    private static indent = 4;

    execute(receiver: EditorFacade): void {
        receiver.insertChar(' '.repeat(Tab.indent));
        receiver.handleCursorOperation(new CursorOperations.MoveRight(Tab.indent));
    }

    undo(receiver: EditorFacade): void {
        for(let i = 0; i < Tab.indent; i++)
            receiver.deleteChar();

        receiver.handleCursorOperation(new CursorOperations.MoveLeft(Tab.indent));
    }
}

export class CursorMove implements IEditorCommand {
    constructor(
        private strategy: CursorMoveStrategy
    ) {}

    execute(receiver: EditorFacade): void {
        this.strategy.move(receiver);
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

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
    }
}

export class Backspace implements IEditorCommand {
    constructor(
        private strategy: IBackspaceStrategy
    ) {}

    execute(receiver: EditorFacade): void {
        if (this.isLineEmpty(receiver)) {
            if (!this.isLinesLeft(receiver)) return;
            this.removeLine(receiver);
            return;
        }

        this.strategy.execute(receiver);
    }

    private removeLine(receiver: EditorFacade) {
        receiver.deleteLine();
        receiver.handleCursorOperation(new CursorOperations.MoveUp());
        receiver.handleCursorOperation(new CursorOperations.MoveRight(
            receiver.getCurrentLineLength()
        ));
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

export class NoOperation implements IEditorCommand {
    execute(receiver: EditorFacade): void {}
    undo(): void {}
}

}
