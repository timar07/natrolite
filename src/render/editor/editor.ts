import Cursor from "./view/cursor/cursor";
import VisualPosition from "./visualPosition";
import { SelectionRange } from "./visualRange";
import EditorRenderer, { RenderingEvent } from "./editor/editorRenderer";
import { MoveOperation } from "./view/cursor/cursorOperations";
import { EditorKeyboardHandlerFactory } from "./editorKeyboard";
import { DocumentEvent, DocumentProcessor } from "./documentProcessor";
import { CommandStack } from "./commandStack";

export default class EditorFacade {
    private view = new EditorRenderer();
    private editorPosition = new VisualPosition(0, 0);
    private document = new DocumentProcessor();
    private cursor = new Cursor(
        this.view.getElement(),
        new DOMRect(100, 50, 8, 16.5) // FIXME: Hardcoded
    );
    private commandStack = new CommandStack([]);

    constructor() {
        this.cursor.onUpdate = () => {
            this.editorPosition = this.getPosition();
        };

        document.onkeydown = this.handleKeyPress.bind(this);
        this.document.onChange = (ev) => this.view.renderChanges(
            this.createRenderingEvent(ev)
        );
        this.document.setState('hello, world!\nsome example');
    }

    public getDocument() {
        return this.document;
    }

    public resetSelection() {
        document.getSelection()?.removeAllRanges();
    }

    public handleCursorOperation(operation: MoveOperation) {
        operation.execute(this.cursor);
    }

    public getLastLineIndex() {
        return this.view.getLastLineIndex();
    }

    public getCurrentLineLength() {
        return this.view.getLineLength(this.editorPosition.getLine())
    }

    public getPosition(): VisualPosition { // TODO: Cache
        const relativeRect = this.getRelativeCursorRect();
        return new VisualPosition(
            (relativeRect.top + this.view.getElement().scrollTop) / relativeRect.height,
            relativeRect.left / relativeRect.width,
        );
    }

    private createRenderingEvent(ev: DocumentEvent): RenderingEvent {
        return new RenderingEvent(
            new SelectionRange(
                this.document.getVisualPositionFromOffset(ev.startOffset),
                this.document.getVisualPositionFromOffset(ev.endOffset)
            ),
            ev.str
        );
    }

    private handleKeyPress(event: KeyboardEvent) {
        event.preventDefault();

        try {
            const command = new EditorKeyboardHandlerFactory(this).getCommand(event);

            console.log(this.commandStack)

            if (typeof command !== 'undefined') {
                this.commandStack.push(command);
                command.execute(this);
            }
        } catch (exception) {
            this.handleException(exception);
        }
    }

    private handleException(exception: any) {
        console.log('undo')
        this.commandStack.undo(this);
    }

    private getRelativeCursorRect(): DOMRect {
        const editorRect = this.view.getWindowRect();
        const cursor = this.cursor.getCurrentRect();

        return new DOMRect(
            cursor.left - editorRect.left,
            cursor.top - editorRect.top,
            cursor.width,
            cursor.height
        );
    }
}
