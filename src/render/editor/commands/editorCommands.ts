import { CursorOperations } from "../view/cursor/cursorOperations";
import EditorFacade, { ICommand as Command, IPrimitiveCommand } from "../editor";
import { CursorMoveStrategy } from "./cursorMove";

export interface EditingCommand extends Command<EditorFacade> {}
export interface EditorCursorCommand extends IPrimitiveCommand<EditorFacade> {};

export namespace EditorCommands {

export class InsertChar implements EditingCommand {
    constructor(
        private char: string
    ) {}

    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        document.insertString(
            document.getOffsetFromVisualPosition(
                receiver.getPosition()
            ),
            this.char
        );
        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
    }
}

export class Enter implements EditingCommand {
    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        document.insertString(
            document.getOffsetFromVisualPosition(
                receiver.getPosition()
            ),
            '\n'
        );

        receiver.handleCursorOperation(new CursorOperations.CarriageReturn());
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    private breakLine(receiver: EditorFacade) {
        // const pos = receiver.getPosition();
        // const content = receiver.getLineContent(pos.getLine());
        // receiver.setLineContent(content.slice(0, pos.getCol()), pos.getLine());
        // receiver.addLine(content.slice(pos.getCol()), receiver.getPosition().getLine() + 1);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export class Tab implements EditingCommand {
    private static indent = 4;

    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        // document.insertString(receiver.getPosition().offset, ' '.repeat(Tab.indent)); // TODO
        receiver.handleCursorOperation(new CursorOperations.MoveRight(Tab.indent));
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Not implemented");
    }
}

export class CursorMove implements EditingCommand {
    constructor(
        private strategy: CursorMoveStrategy
    ) {}

    execute(receiver: EditorFacade): void {
        this.strategy.move(receiver);
        this.normalizeHorizontalPosition(receiver);
    }

    // Prevents the cursor from being in a non-existing position
    private normalizeHorizontalPosition(receiver: EditorFacade) {
        // if (!this.isOutOfLine(receiver)) return;

        // receiver.handleCursorOperation(
        //     new CursorOperations.MoveLeft(this.getOverflow(receiver))
        // );
    }

    private isOutOfLine(receiver: EditorFacade) {
        // return receiver.getCurrentLineLength() < receiver.getPosition().getCol()
    }

    private getOverflow(receiver: EditorFacade) {
        // return receiver.getPosition().getCol() - receiver.getCurrentLineLength()
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
    }
}

}
