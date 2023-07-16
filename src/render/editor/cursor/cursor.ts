import CursorState from "./cursorState";
import CursorRenderer from "./cursorRenderer";
import { MouseDown, MouseMove } from "./cursorEvents";
import { UnderlineDecorator } from "./cursorDecorations";
import { CursorOperation } from "./cursorOperations";
import "./cursor.css";

export default class Cursor {
    private view;
    private state = new CursorState();
    private isMouseDown = false;

    public onUpdate?: () => void;

    constructor(
        private initialRect: DOMRect
    ) {
        this.view = new UnderlineDecorator(
            new CursorRenderer()
        );

        this.state.setFromRect(initialRect);
        this.view.render(this.state);

        document.onmousedown = (e) => {
            new MouseDown().handle(e, this.state);
            this.view.render(this.state);
            this.state.isMouseDown = true;
            this.onUpdate?.();
        };

        document.onmouseup = (e) => {
            this.state.isMouseDown = false;
        }

        document.onmousemove = (e) => {
            new MouseMove().handle(e, this.state);
            this.view.render(this.state);
            this.onUpdate?.();
        }
    }

    getCurrentRect() {
        return this.state.getRect();
    }

    handleOperation(op?: CursorOperation) {
        if (!op) return;
        this.setNewPosition(op.getMoveMatrix());
    }

    // * IMPORTANT: this only works only if the font is monospaced;
    private setNewPosition(moveMatrix: [number, number]) {
        const rect = this.state.getRect();
        this.state.setFromRect(new DOMRect(
            rect.x == -Infinity ? this.initialRect.left: rect.x + rect.width  * moveMatrix[0],
            rect.y + rect.height * moveMatrix[1],
            rect.width,
            rect.height
        ));
        this.view.render(this.state);
        this.onUpdate?.();
    }
}
