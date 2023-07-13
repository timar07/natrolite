import "./line.css";

export default class LineRenderer {
    private element: HTMLElement;
    private content: string;

    constructor(content: string) {
        this.content = content;
        this.element = this.createLine(content);
    }

    public getContent() { return this.content }
    public getElement() { return this.element }

    private createLine(content: string): HTMLElement {
        const element = document.createElement('pre');
        element.className = 'TextEditor__line';

        const span = document.createElement('pre');
        span.textContent = content;

        element.appendChild(span);
        return element;
    }
}
