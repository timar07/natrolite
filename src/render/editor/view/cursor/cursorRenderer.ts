import CursorState from "./cursorState";

export default class CursorRenderer {
    private root: HTMLElement;
    private element: HTMLElement;

    constructor() {
        this.element = this.createElement();
        this.root = document.querySelector<HTMLElement>('.TextEditor') as HTMLElement;
        this.root.append(this.element);
    }

    public getElement() { return this.element }

    public render(state: CursorState) {
        const pos = state.getAbsolutePosition();
        const rect = state.getRect();

        this.element.style.top = pos.y + 'px';
        this.element.style.left = pos.x + 'px';
        this.element.style.height = rect.height + 'px';
        this.element.style.width = rect.width + 'px';
    }

    private createElement() {
        const cursor = document.createElement('div');
        cursor.className = 'TextEditor__cursor';
        return cursor;
    }
}
