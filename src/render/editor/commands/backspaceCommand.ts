import { CursorOperations } from "../view/cursor/cursorOperations";
import { IEditingCommand } from "./editorCommands";
import EditorFacade from "../editor";

export class Backspace implements IEditingCommand {
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
        const line = this.receiver.getPosition().line;
        const contents = this.receiver.getLineContent(line);
        const document = this.receiver.getDocument();
        this.receiver.deleteLine(line);
        this.receiver.handleCursorOperation(new CursorOperations.MoveUp());
        this.receiver.handleCursorOperation(new CursorOperations.MoveRight(
            this.receiver.getCurrentLineLength()
        ));
        document.insertString(this.receiver.getPosition().offset, contents);
    }

    private isLineEmpty() {
        return this.receiver.getPosition().col <= 0
    }

    private isLinesLeft() {
        return this.receiver.getPosition().line > 0
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
        // receiver.deleteChar();// TODO
        receiver.handleCursorOperation(new CursorOperations.MoveLeft());
    }
}

export class LineDiscard implements IBackspaceStrategy {
    execute(receiver: EditorFacade): void {
        while (receiver.getPosition().col > 0) {
            // receiver.deleteChar(); // TODO
            receiver.handleCursorOperation(new CursorOperations.MoveLeft());
        }
    }
}
