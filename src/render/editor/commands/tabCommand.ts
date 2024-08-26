import { DocumentProcessor } from '../documentProcessor';
import EditorFacade from "../editor";
import { CursorOperations } from "../view/cursor/cursorOperations";
import VisualPosition from '../visualPosition';
import { EditingCommand } from "./editorCommands";

export class Tab implements EditingCommand {
    public static indent = 4;

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

export class Unindent implements EditingCommand {
    execute(receiver: EditorFacade): void {
        const document = receiver.getDocument();

        for (let i = 0; i < Tab.indent && this.removeStartingSpace(receiver); i++) {
            receiver.handleCursorOperation(new CursorOperations.MoveLeft(1));
        }
    }

    undo(receiver: EditorFacade): void {
        throw new Error('Method not implemented.');
    }

    private removeStartingSpace(receiver: EditorFacade) {
        const document = receiver.getDocument();
        const offset = document.getOffsetFromVisualPosition(
            new VisualPosition(
                receiver.getPosition().getLine(),
                0
            )
        );

        return this.removeSpace(document, offset);
    }

    private removeSpace(document: DocumentProcessor, offset: number) {
        if (document.state[offset] == ' ') {
            document.removeString(offset, offset + 1);
            return true;
        }

        return false;
    }
}
