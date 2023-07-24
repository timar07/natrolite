import { CursorOperations } from "../../cursor/cursorOperations";
import EditorFacade from "../editor";

export interface IBackspaceStrategy {
    execute(receiver: EditorFacade): void;
}

export class SingleChar implements IBackspaceStrategy {
    execute(receiver: EditorFacade): void {
        receiver.deleteChar();
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }
}

export class LineDiscard implements IBackspaceStrategy {
    execute(receiver: EditorFacade): void {
        while (receiver.getPosition().col > 0) {
            receiver.deleteChar();
            receiver.handleCursorOperation(new CursorOperations.MoveLeft());
        }
    }
}
