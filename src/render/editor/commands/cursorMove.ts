import EditorFacade from "../editor";
import { CursorOperations } from "../view/cursor/cursorOperations";
import { EditingCommand } from "./editorCommands";

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
        const overflow = this.getOverflow(receiver);

        if (this.isOutOfLine(receiver)) {
            receiver.handleCursorOperation(
                new CursorOperations.MoveLeft(overflow > 0 ? overflow : 0)
            )
        }
    }

    private isOutOfLine(receiver: EditorFacade) {
        return receiver.getCurrentLineLength() < receiver.getPosition().getCol();
    }

    private getOverflow(receiver: EditorFacade) {
        return receiver.getPosition().getCol() - receiver.getCurrentLineLength()
    }

    undo(receiver: EditorFacade): void {
        this.strategy.undo(receiver)
    }
}

export interface CursorMoveStrategy {
    move(receiver: EditorFacade): void;
    undo(receiver: EditorFacade): void;
}

export class Up implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        if (receiver.getPosition().getLine() == 0) return;
        receiver.handleCursorOperation(new CursorOperations.MoveUp());
    }

    undo(receiver: EditorFacade): void {
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }
}

export class Down implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        if (this.isAtEnd(receiver)) return;
        const prevPosition = receiver.getPosition().getCol();
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
        const overflow = prevPosition - receiver.getPosition().getCol();
        receiver.handleCursorOperation(new CursorOperations.MoveLeft(
            overflow > 0 ? overflow : 0
        ));
    }

    private isAtEnd(receiver: EditorFacade) {
        return receiver.getPosition().getLine() == receiver.getLastLineIndex();
    }

    undo(receiver: EditorFacade): void {
        receiver.handleCursorOperation(new CursorOperations.MoveUp());
    }
}

export class Left implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        receiver.resetSelection();
        if (this.isAtStart(receiver)) {
            if (receiver.getPosition().getLine() != 0)
                this.moveToPrevLine(receiver);
            return;
        }
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }

    private moveToPrevLine(receiver: EditorFacade) {
        receiver.handleCursorOperation(new CursorOperations.MoveUp());
        receiver.handleCursorOperation(
            new CursorOperations.MoveRight(
                receiver.getCurrentLineLength()
            )
        );
    }

    private isAtStart(receiver: EditorFacade) {
        return receiver.getPosition().getCol() == 0;
    }

    undo(receiver: EditorFacade): void {
        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }
}

export class Right implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        receiver.resetSelection();
        if (this.isOutOfLine(receiver)) {
            if (receiver.getPosition().getLine() != receiver.getLastLineIndex())
                this.moveToNextLine(receiver);
            return;
        }

        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }

    private moveToNextLine(receiver: EditorFacade) {
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
        receiver.handleCursorOperation(
            new CursorOperations.MoveLeft(
                receiver.getPosition().getCol()
            )
        );
    }

    private isOutOfLine(receiver: EditorFacade) {
        return receiver.getPosition().getCol() >= receiver.getCurrentLineLength();
    }

    undo(receiver: EditorFacade): void {
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }
}

export class LineStart implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        receiver.handleCursorOperation(
            new CursorOperations.MoveLeft(
                receiver.getPosition().getCol()
            )
        );
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
    }
}

export class LineEnd implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        receiver.handleCursorOperation(
            new CursorOperations.MoveRight(
                receiver.getCurrentLineLength()
            )
        );
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
    }
}
