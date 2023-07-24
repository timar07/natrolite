import { EditorCommands, IEditorCommand } from "./editorCommands";

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
    getCommand(event: KeyboardEvent): IEditorCommand | undefined;
}

class SimpleOperation implements IKeybardHandler {
    getCommand(event: KeyboardEvent): IEditorCommand | undefined {
        switch (event.key) {
            case 'Backspace':
                return new EditorCommands.Backspace();
            case 'ArrowLeft':
                return new EditorCommands.ArrowLeft();
            case 'ArrowRight':
                return new EditorCommands.ArrowRight();
            case 'ArrowDown':
                return new EditorCommands.ArrowDown();
            case 'ArrowUp':
                return new EditorCommands.ArrowUp();
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


    private isPrintableChar(key: string) {
        return key.length == 1;
    }
}

class ControlOperation implements IKeybardHandler {
    getCommand(event: KeyboardEvent): IEditorCommand | undefined {
        switch (event.key) {
            case 'ArrowLeft':
                return new EditorCommands.MoveLineStart();
            case 'ArrowRight':
                return new EditorCommands.MoveLineEnd();
            case 'Backspace':
                return new EditorCommands.ClearLine();
        }
    }
}

class ShiftOperation implements IKeybardHandler {
    getCommand(event: KeyboardEvent): IEditorCommand | undefined {
        return undefined;
    }
}
