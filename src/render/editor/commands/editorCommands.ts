import { CursorOperations } from "../view/cursor/cursorOperations";
import EditorFacade, { ICommand, IPrimitiveCommand } from "../editor";
import { IBackspaceStrategy } from "./backspaceCommand";
import { CursorMoveStrategy } from "./cursorMove";

export interface IEditingCommand extends ICommand<EditorFacade> {}
export interface IEditorCursorCommand extends IPrimitiveCommand<EditorFacade> {};

export namespace EditorCommands {

export class InsertChar implements IEditingCommand {
    constructor(
        private char: string
    ) {}

    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        document.insertString(receiver.getPosition().offset, this.char);
        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
    }
}

export class Enter implements IEditingCommand {
    execute(receiver: EditorFacade): void {
        this.breakLine(receiver);
        receiver.handleCursorOperation(new CursorOperations.CarriageReturn());
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    private breakLine(receiver: EditorFacade) {
        const pos = receiver.getPosition();
        const content = receiver.getLineContent(pos.line);
        receiver.setLineContent(content.slice(0, pos.col), pos.line);
        receiver.addLine(content.slice(pos.col), receiver.getPosition().line + 1);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class Tab implements IEditingCommand {
    private static indent = 4;

    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        document.insertString(receiver.getPosition().offset, ' '.repeat(Tab.indent));
        receiver.handleCursorOperation(new CursorOperations.MoveRight(Tab.indent));
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Not implemented");
    }
}

export class CursorMove implements IEditingCommand {
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

}
