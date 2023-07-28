import EditorFacade from "../editor";
import { CursorOperations } from "../view/cursor/cursorOperations";

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
        throw new Error("Method not implemented.");
    }
}

export class Down implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        if (receiver.getPosition().getLine() == receiver.getLastLineIndex())
            return;
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
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
