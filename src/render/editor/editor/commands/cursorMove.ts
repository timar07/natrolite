import EditorFacade from "../editor";
import { CursorOperations } from "../../cursor/cursorOperations";

export interface CursorMoveStrategy {
    move(receiver: EditorFacade): void;
}

export class Up implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        if (receiver.getPosition().line == 0) return;
        receiver.handleCursorOperation(new CursorOperations.MoveUp());
    }
}

export class Down implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        if (receiver.getPosition().line == receiver.getLastLineIndex())
            return;
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }
}

export class Left implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        receiver.resetSelection();
        if (receiver.getPosition().col == 0) return;
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }
}

export class Right implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        receiver.resetSelection();
        if (receiver.getPosition().col >= receiver.getCurrentLineLength())
            return;

        receiver.handleCursorOperation(new CursorOperations.MoveRight());
    }
}

export class LineStart implements CursorMoveStrategy {
    move(receiver: EditorFacade): void {
        receiver.handleCursorOperation(
            new CursorOperations.MoveLeft(
                receiver.getPosition().col
            )
        );
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
}
