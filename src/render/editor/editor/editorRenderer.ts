import LinesRenderer, { Delete, Insert } from "../lines/linesRenderer";
import { TEditorPosition } from "./editor";
import "./editor.css";

export default class EditorRenderer {
    private root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
    private lines = new LinesRenderer(
        document.querySelector<HTMLElement>('.TextEditor__wrap') as HTMLElement
    );

    constructor() {}

    public getLineLength(at: TEditorPosition) {
        return this.lines.getLineLength(at);
    }

    public addLine(content: string, at: TEditorPosition) {
        this.lines.addLine(content, at);
    }

    public deleteLine(at: TEditorPosition) {
        this.lines.deleteLine(at);
    }

    public getWindowRect(): DOMRect {
        return this.root.getClientRects()[0];
    }

    public insertCharAt(pos: TEditorPosition, char: string) {
        this.lines.edit(pos, new Insert(char));
    }

    public deleteCharAt(pos: TEditorPosition) {
        this.lines.edit(pos, new Delete());
    }
}
