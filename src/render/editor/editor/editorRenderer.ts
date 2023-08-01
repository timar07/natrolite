import LinesRenderer from "../view/lines/linesRenderer";
import VisualPosition from "../visualPosition";
import { InlineRange, SelectionRange, VisualRange } from "../visualRange";
import "./editor.css";

export class RenderingEvent {
    constructor(
        private range: SelectionRange,
        private content: string
    ) {}

    public getRange() { return this.range; }
    public getContent() { return this.content; }
};

export default class EditorRenderer {
    private root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
    private lines = new LinesRenderer(
        document.querySelector<HTMLElement>('.TextEditor__wrap') as HTMLElement
    );

    constructor() {
    }

    public renderChanges(ev: RenderingEvent) {
        console.log(ev)
        this.removeTextRange(ev.getRange());
        this.insertText(ev.getContent(), ev.getRange().getStart());
    }

    public getElement() { return this.root; }

    public getLineLength(line: number) {
        return this.lines.getLineLength(line);
    }

    public getWindowRect(): DOMRect {
        return this.root.getClientRects()[0];
    }

    public getLastLineIndex() {
        return this.lines.getLastLineIndex();
    }

    private insertText(content: string, pos: VisualPosition) {
        const line = pos.getLine();
        const lineText = this.lines.getLineContent(line);
        const rawString = lineText.slice(0, pos.getCol()) + content + lineText.slice(pos.getCol());

        rawString.split('\n').forEach((lineText, innerLineIndex) => {
            innerLineIndex == 0
                ? this.lines.setLineContent(lineText, line + innerLineIndex)
                : this.lines.addLine(lineText, line + innerLineIndex);
        });
    }

    private removeTextRange(range: SelectionRange) {
        range.getStart().getLine() == range.getEnd().getLine()
            ? this.removeInlineRange(range)
            : this.removeMultilineTextRange(range);
    }

    private removeInlineRange(range: SelectionRange) {
        const line = range.getStart().getLine();
        const start = range.getStart().getCol();
        const end = range.getEnd().getCol();
        const lineContent = this.lines.getLineContent(line);

        this.lines.setLineContent(
            lineContent.slice(0, start) + lineContent.slice(end),
            line
        );
    }

    private removeMultilineTextRange(range: SelectionRange) {
        const start = range.getStart();
        const end = range.getEnd();

        this.lines.setLineContent(
            this.lines.getLineContent(start.getLine()).slice(0, start.getCol()),
            start.getLine()
        );

        for (let line = start.getLine()+1; line < end.getLine()-1; line++) {
            this.lines.deleteLine(line);
        }

        this.lines.setLineContent(
            this.lines.getLineContent(end.getLine()).slice(end.getCol()),
            end.getLine()
        );
    }
}
