import { EditingCommand } from "./commands/editorCommands";
import EditorFacade from "./editor";

export class CommandStack {
    private state;
    private current;

    constructor(initialState: EditingCommand[]) {
        this.state = initialState;
        this.current = initialState.length ? initialState.length - 1: 0;
    }

    public push(command: EditingCommand) {
        this.state.push(command);
        this.current += 1;
    }

    public redo(receiver: EditorFacade) {
        this.shiftForward()?.execute(receiver);
    }

    public undo(receiver: EditorFacade) {
        this.shiftBack()?.undo(receiver);
    }

    private shiftForward(): EditingCommand | undefined {
        if (this.current < this.state.length) {
            this.current += 1;
            return this.state[this.current - 1]
        }

        return undefined;
    }

    private shiftBack(): EditingCommand | undefined {
        if (this.current > 0) {
            this.current -= 1;
            return this.state[this.current + 1]
        }

        return undefined;
    }
}
