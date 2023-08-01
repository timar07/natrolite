import { CursorOperations } from "../view/cursor/cursorOperations";
import { EditingCommand } from "./editorCommands";
import EditorFacade from "../editor";

export class Backspace implements EditingCommand {
    constructor(
        private receiver: EditorFacade,
        private strategy: BackspaceStrategy
    ) {}

    execute(receiver: EditorFacade): void {
        if (this.isLineEmpty()) {
            if (!this.isLinesLeft()) return;
            this.deleteLine(receiver);
            return;
        }

        this.strategy.execute(receiver);
    }

    private deleteLine(receiver: EditorFacade) {
        new SingleChar().execute(receiver);
        this.receiver.handleCursorOperation(new CursorOperations.MoveRight(
            this.receiver.getCurrentLineLength()
        ));
    }

    private isLineEmpty() {
        return this.receiver.getPosition().getCol() <= 0
    }

    private isLinesLeft() {
        return this.receiver.getPosition().getLine() > 0
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }
}

export interface BackspaceStrategy {
    execute(receiver: EditorFacade): void;
}

export class SingleChar implements BackspaceStrategy {
    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        const pos = receiver.getPosition();
        const offset = document.getOffsetFromVisualPosition(pos);
        document.removeString(offset - 1, offset);
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }
}

export class LineDiscard implements BackspaceStrategy {
    execute(receiver: EditorFacade): void {
        while (receiver.getPosition().getCol() > 0) {
            // receiver.deleteChar(); // TODO
            receiver.handleCursorOperation(new CursorOperations.MoveLeft());
        }
    }
}
