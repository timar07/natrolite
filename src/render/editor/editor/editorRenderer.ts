import LinesRenderer from "../view/lines/linesRenderer";
import { TEditorPosition } from "../editor";
import { DocumentEvent } from "../documentProcessor";
import "./editor.css";

export default class EditorRenderer {
    private root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
    private lines = new LinesRenderer(
        document.querySelector<HTMLElement>('.TextEditor__wrap') as HTMLElement
    );

    constructor() {}

    public renderChanges(ev: DocumentEvent) {
        const start = ev.document.getVisualPositionFromOffset(ev.startOffset);
        const end = ev.document.getVisualPositionFromOffset(ev.startOffset);

        for (let lineIndex = start.getLine(); lineIndex <= end.getLine(); lineIndex++) {
            const lineText = this.lines.getLineContent(lineIndex);
            ev.str.split('\n').forEach((textFragment, index) => {
                this.lines.setLineContent(
                    lineText.slice(0, start.getCol()) + textFragment + lineText.slice(end.getCol()),
                    start.getLine() + index
                );
            });
        }
    }

    public getElement() { return this.root; }

    public getLineLength(line: number) {
        return this.lines.getLineLength(line);
    }

    public addLine(content: string, at: number) {
        this.lines.addLine(content, at);
    }

    public deleteLine(line: number) {
        this.lines.deleteLine(line);
    }

    public getWindowRect(): DOMRect {
        return this.root.getClientRects()[0];
    }

    public insertCharAt(pos: TEditorPosition, char: string) {
        // this.lines.edit(pos, new Insert(char));
    }

    public deleteCharAt(pos: TEditorPosition) {
        // this.lines.edit(pos, new Delete());
    }

    public getLastLineIndex() {
        return this.lines.getLastLineIndex();
    }
}
