import EditorFacade from "../editor";
import { CursorOperations } from "../view/cursor/cursorOperations";
import { Backspace, SingleChar } from "./backspaceCommand";
import { EditingCommand } from "./editorCommands";

export class Enter implements EditingCommand {
    execute(receiver: EditorFacade): void {
        this.breakLine(receiver);
        receiver.handleCursorOperation(new CursorOperations.CarriageReturn());
        receiver.handleCursorOperation(new CursorOperations.MoveDown());
    }

    private breakLine(receiver: EditorFacade) {
        const document = receiver.getDocument();
        document.insertString(
            document.getOffsetFromVisualPosition(receiver.getPosition()),
            '\n'
        );
    }

    undo(receiver: EditorFacade): void {
        new Backspace(receiver, new SingleChar()).execute(receiver)
    }
}
