import { Backspace, LineDiscard, SingleChar } from "./commands/backspaceCommand";
import { Down, Left, LineEnd, LineStart, Right, Up } from "./commands/cursorMove";
import { EditorCommands, IEditingCommand } from "./commands/editorCommands";
import EditorFacade from "./editor";

export class EditorKeyboardHandlerFactory {
    constructor(
        private receiver: EditorFacade
    ) {}

    getCommand(event: KeyboardEvent) {
        return this.getOperation(event).getCommand(event);
    }

    private getOperation(event: KeyboardEvent) {
        if (this.isControlKey(event))
            return new ControlOperation(this.receiver);
        else if (event.shiftKey)
            return new ShiftOperation();

        return new SimpleOperation(this.receiver);
    }

    private isControlKey(event: KeyboardEvent) {
        return process.platform == 'darwin' ? event.metaKey: event.ctrlKey;
    }
}

interface KeyboardHandler {
    getCommand(event: KeyboardEvent): IEditingCommand | undefined;
}

class ControlOperation implements KeyboardHandler {
    constructor(
        private receiver: EditorFacade
    ) {}

    getCommand(event: KeyboardEvent): IEditingCommand | undefined {
        switch (event.key) {
            case 'ArrowLeft':
                return new EditorCommands.CursorMove(new LineStart());
            case 'ArrowRight':
                return new EditorCommands.CursorMove(new LineEnd());
            case 'Backspace':
                return new Backspace(this.receiver, new LineDiscard());
        }
    }
}

abstract class TypableOperation {
    protected isPrintableChar(key: string) {
        return key.length == 1;
    }
}

class SimpleOperation extends TypableOperation implements KeyboardHandler {
    constructor(
        private receiver: EditorFacade
    ) {
        super()
    }

    getCommand(event: KeyboardEvent): IEditingCommand | undefined {
        switch (event.key) {
            case 'Backspace':
                return new Backspace(this.receiver, new SingleChar());
            case 'ArrowLeft':
                return new EditorCommands.CursorMove(new Left());
            case 'ArrowRight':
                return new EditorCommands.CursorMove(new Right());
            case 'ArrowDown':
                return new EditorCommands.CursorMove(new Down());
            case 'ArrowUp':
                return new EditorCommands.CursorMove(new Up());
            case 'Enter':
                return new EditorCommands.Enter();
            case 'Tab':
                return new EditorCommands.Tab();
            default: {
                if (!this.isPrintableChar(event.key))
                    return;

                return new EditorCommands.InsertChar(event.key.toString());
            }
        }
    }
}

class ShiftOperation extends TypableOperation implements KeyboardHandler {
    getCommand(event: KeyboardEvent): IEditingCommand | undefined {
        if (!this.isPrintableChar(event.key))
            return;
        // event.key is capitalized by default, so we don't need to use .toUpperCase()
        return new EditorCommands.InsertChar(event.key.toString());
    }
}
