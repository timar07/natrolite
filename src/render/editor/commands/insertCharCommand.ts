import EditorFacade from "../editor";
import { CursorOperations } from "../view/cursor/cursorOperations";
import { EditingCommand } from "./editorCommands";

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