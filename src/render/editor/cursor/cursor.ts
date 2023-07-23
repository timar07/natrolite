import CursorState from "./cursorState";
import CursorRenderer from "./cursorRenderer";
import { MouseDown, MouseMove } from "./cursorEvents";
import { DefaultDecorator } from "./cursorDecorations";
import { IMoveOperation } from "./cursorOperations";
import "./cursor.css";

export default class Cursor {
    private view = new DefaultDecorator(
        new CursorRenderer()
    );
    private state = new CursorState();
    private isMouseDown = false;
    private lineWidth = 0;

    public onUpdate?: () => void;

    constructor(
        private parent: HTMLElement,
        private initialRect: DOMRect
    ) {
        this.state.setFromRect(initialRect);
        this.view.render(this.state);

        parent.onmousedown = (e) => {
            new MouseDown().handle(e, this.state);
            this.view.render(this.state);
            this.state.isMouseDown = true;
            this.onUpdate?.();
        };

        parent.onmouseup = (e) => {
            this.state.isMouseDown = false;
        }

        parent.onmousemove = (e) => {
            new MouseMove().handle(e, this.state);
            this.view.render(this.state);
            this.onUpdate?.();
        }
    }

    getCurrentRect() {
        return this.state.getRect();
    }

    handleOperation(op?: IMoveOperation) {
        if (!op) return;
        this.setNewPosition(op.getMoveMatrix());
    }

    // * IMPORTANT: this only works only if the font is monospaced;
    private setNewPosition(moveMatrix: [number, number]) {
        this.state.setFromRect(this.moveRect(moveMatrix));
        this.view.render(this.state);
        this.onUpdate?.();
    }

    private moveRect(moveMatrix: [number, number]) {
        const rect = this.state.getRect();
        return new DOMRect(
            this.getHorizontalMove(moveMatrix[0]),
            this.getVerticalMove(moveMatrix[1]),
            rect.width,
            rect.height
        );
    }

    private getHorizontalMove(move: number) {
        const rect = this.state.getRect();

        if (rect.x == -Infinity) {
            return this.initialRect.left;
        }

        if (rect.x == Infinity) {
            return this.initialRect.left + this.lineWidth;
        }

        return rect.x + rect.width * move;
    }

    private getVerticalMove(move: number) {
        const rect = this.state.getRect();
        return rect.y + rect.height * move;
    }
}
