import LinesRenderer from "../lines/linesRenderer";
import { TEditorPosition } from "./editor";
import "./editor.css";

export default class EditorRenderer {
    private root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
    private lines = new LinesRenderer(
        document.querySelector<HTMLElement>('.TextEditor__wrap') as HTMLElement
    );

    constructor() {}

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
        this.lines.insertCharAt(pos, char);
    }

    public deleteCharAt(pos: TEditorPosition) {
        this.lines.deleteCharAt(pos);
    }
}
