import CursorRenderer from "./cursorRenderer";
import CursorState from "./cursorState";

export abstract class CursorDecorator extends CursorRenderer {
    constructor(protected cursor: CursorRenderer) {
        super();
    }

    public render(state: CursorState) {
        this.cursor.render(state);
    }
}

export class UnderlineDecorator extends CursorDecorator {
    public render(state: CursorState): void {
        this.cursor.render(state);
        this.renderUnderline();
    }

    private renderUnderline() {
        const element = this.cursor.getElement();
        element.style.borderBottom = '1px solid var(--natrolite-font-color)';
    }
}

export class DefaultDecorator extends CursorDecorator {
    public render(state: CursorState): void {
        this.cursor.render(state);
        this.renderUnderline();
    }

    private renderUnderline() {
        const element = this.cursor.getElement();
        element.style.borderLeft = '1px solid var(--natrolite-font-color)';
    }
}
