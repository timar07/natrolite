import EditorFacade from "../editor";
import { Command, PrimitiveCommand } from "../core/command";

export interface EditingCommand extends Command<EditorFacade> {}
export interface EditorCursorCommand extends PrimitiveCommand<EditorFacade> {};
