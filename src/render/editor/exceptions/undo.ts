import { DocumentProcessor } from '../documentProcessor';
import EditorFacade from "../editor";
import { CursorOperations } from "../view/cursor/cursorOperations";
import VisualPosition from '../visualPosition';
import { EditingCommand } from "../commands/editorCommands";
import { EditingException } from './editingException';

export class Undo implements EditingException {
    undo(receiver: EditorFacade): void {
        throw new Error('Method not implemented.');
    }
    execute(receiver: EditorFacade): void {
        throw new Error('Method not implemented.');
    }
}
