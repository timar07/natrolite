import { LineDiscard, SingleChar } from "./commands/backspace";
import { Down, Left, LineEnd, LineStart, Right, Up } from "./commands/cursorMove";
import { EditorCommands, IEditingCommand } from "./commands/editorCommands";

export class EditorKeyboardHandler {
    getCommand(event: KeyboardEvent) {
        return this.getOperation(event).getCommand(event);
    }

    private getOperation(event: KeyboardEvent) {
        if (this.isControlKey(event))
            return new ControlOperation();
        else if (event.shiftKey)
            return new ShiftOperation();

        return new SimpleOperation();
    }

    private isControlKey(event: KeyboardEvent) {
        return process.platform == 'darwin' ? event.metaKey: event.ctrlKey;
    }
}

interface IKeybardHandler {
    getCommand(event: KeyboardEvent): IEditingCommand | undefined;
}

class ControlOperation implements IKeybardHandler {
    getCommand(event: KeyboardEvent): IEditingCommand | undefined {
        switch (event.key) {
            case 'ArrowLeft':
                return new EditorCommands.CursorMove(new LineStart());
            case 'ArrowRight':
                return new EditorCommands.CursorMove(new LineEnd());
            case 'Backspace':
                return new EditorCommands.Backspace(new LineDiscard());
        }
    }
}

abstract class TypableOperation {
    protected isPrintableChar(key: string) {
        return key.length == 1;
    }
}

class SimpleOperation extends TypableOperation implements IKeybardHandler {
    getCommand(event: KeyboardEvent): IEditingCommand | undefined {
        switch (event.key) {
            case 'Backspace':
                return new EditorCommands.Backspace(new SingleChar());
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

class ShiftOperation extends TypableOperation implements IKeybardHandler {
    getCommand(event: KeyboardEvent): IEditingCommand | undefined {
        if (!this.isPrintableChar(event.key))
            return;
        // event.key is capitalized by default, so we don't need to use .toUpperCase()
        return new EditorCommands.InsertChar(event.key.toString());
    }
}
