import LinesRenderer, { Delete, Insert } from "../lines/linesRenderer";
import { TEditorPosition } from "./editor";
import "./editor.css";

export default class EditorRenderer {
    private root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
    private lines = new LinesRenderer(
        document.querySelector<HTMLElement>('.TextEditor__wrap') as HTMLElement
    );

    constructor() {}

    public getElement() { return this.root; }

    public getLineLength(line: number) {
        return this.lines.getLineLength(line);
    }

    public getLineContents(line: number) {
        return this.lines.getLineContents(line);
    }

    public addLine(content: string, at: TEditorPosition) {
        this.lines.addLine(content, at);
    }

    public deleteLine(line: number) {
        this.lines.deleteLine(line);
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

    public getLastLineIndex() {
        return this.lines.getLastLineIndex();
    }
}
