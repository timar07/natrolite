import EditorFacade from "../editor";
import { CursorOperations } from "../view/cursor/cursorOperations";
import { EditingCommand } from "./editorCommands";

export class Tab implements EditingCommand {
    private static indent = 4;

    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();
        document.insertString(
            document.getOffsetFromVisualPosition(
                receiver.getPosition()
            ),
            ' '.repeat(Tab.indent)
        );
        receiver.handleCursorOperation(new CursorOperations.MoveRight(Tab.indent));
    }

    undo(receiver: EditorFacade): void {
        throw new Error("Not implemented");
    }
}
