import { Command } from "../core/command";
import EditorFacade from "../editor";

export interface EditingException extends Command<EditorFacade> {}
