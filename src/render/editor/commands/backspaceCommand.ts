import { CursorOperations } from "../view/cursor/cursorOperations";
import { EditingCommand } from "./editorCommands";
import EditorFacade from "../editor";

export class Backspace implements EditingCommand {
    constructor(
        private receiver: EditorFacade,
        private strategy: IBackspaceStrategy
    ) {}

    execute(receiver: EditorFacade): void {
        if (this.isLineEmpty()) {
            if (!this.isLinesLeft()) return;
            this.deleteLine();
            return;
        }

        this.strategy.execute(receiver);
    }

    private deleteLine() {
        // const line = this.receiver.getPosition().getLine();
        // const contents = this.receiver.getLineContent(line);
        // const document = this.receiver.getDocument();
        // this.receiver.deleteLine(line);
        // this.receiver.handleCursorOperation(new CursorOperations.MoveUp());
        // this.receiver.handleCursorOperation(new CursorOperations.MoveRight(
        //     this.receiver.getCurrentLineLength()
        // ));
        // document.insertString(this.receiver.getPosition().offset, contents); // TODO
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

export interface IBackspaceStrategy {
    execute(receiver: EditorFacade): void;
}

export class SingleChar implements IBackspaceStrategy {
    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        const pos = receiver.getPosition();
        const offset = document.getOffsetFromVisualPosition(pos);
        document.removeString(offset - 1, offset);
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }
}

export class LineDiscard implements IBackspaceStrategy {
    execute(receiver: EditorFacade): void {
        while (receiver.getPosition().getCol() > 0) {
            // receiver.deleteChar(); // TODO
            receiver.handleCursorOperation(new CursorOperations.MoveLeft());
        }
    }
}
