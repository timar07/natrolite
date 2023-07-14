import RangeUtil from "../cursor/rangeUtil";
import "./line.css";

export default class LineRenderer {
    private root;
    private element: HTMLElement;
    private content: string;
    private rects: DOMRect[];

    constructor(parent: Element, content: string) {
        this.content = content;
        this.element = this.createLineElement(content);
        this.root = parent;
        this.rects = this.createRects();

        this.root.appendChild(this.getElement());
    }

    public getRectByCol(col: number) {
        return this.rects[col];
    }

    public getContent() { return this.content }
    public getElement() { return this.element }
    public getRects() { return this.rects }

    public setContent(content: string) {
        this.content = content;
        this.element.textContent = content;
        this.rects = this.createRects();
    }

    private createLineElement(content: string): HTMLElement {
        const element = document.createElement('pre');
        element.className = 'TextEditor__line';
        element.appendChild(document.createTextNode(content));
        return element;
    }


    private createRects() {
        let rects = [];

        for (let i = 0; i < (this.element.textContent?.length || 0); i++) {
            rects.push(
                RangeUtil.getCharRect(this.element.childNodes[0], i)
            );
        }

        return rects as DOMRect[];
    }
}
