import "./cursor.css";
import RangeUtil from "./rangeUtil";

export type TCursorPosition =  {
    col: number,
    line: number
} & TCursorCoordinates;

export type TCursorCoordinates = {
    x: number,
    y: number
};

export default class CursorRenderer {
    private element: HTMLElement;
    private isMouseDown: boolean = false;
    private cursorPosition: TCursorPosition;
    private parent?: Node;

    constructor() {
        this.element = this.createCursorElement();
        this.cursorPosition = {x: 0, y: 0, col: 0, line: 0};
    }

    public getElement() { return this.element; }

    public getPosition() {
        return this.cursorPosition;
    }

    public handleMouseMove(event: MouseEvent) {
        if (this.isMouseDown) {
            this.handleCursorEvent(event);
        }
    }

    public handleClick(event: MouseEvent) {
        this.isMouseDown = false;
        this.handleCursorEvent(event);
    }

    public handleMouseDown(event: MouseEvent) {
        this.isMouseDown = true;
        this.handleCursorEvent(event);
    }

    public handleMouseUp(event: MouseEvent) {
        this.isMouseDown = false;
    }

    public shiftRightInLine(line: Node, n: number) {
        this.cursorPosition.col += n;
        this.parent = line.childNodes[0];

        this.updateCursorPosition();
    }

    public shiftLeftInLine(line: Node, n: number) {
        this.cursorPosition.col -= n;
        this.parent = line.childNodes[0];

        this.updateCursorPosition();
    }

    private updateCursorPosition() {
        if (typeof this.parent === 'undefined') {
            return;
        }

        const rect = RangeUtil.getCharRect(this.parent, this.cursorPosition.col) ?? new DOMRect(0, 0, 0, 0);
        this.renderAt({
            col: this.cursorPosition.col,
            line: this.cursorPosition.line,
            x: rect.left,
            y: rect.top
        });
    }

    public handleCursorEvent(event: MouseEvent) {
        // @ts-ignore
        this.parent = event.target.childNodes[0];
        const cursorPosition = this.getCursorPosition(
            event.clientX,
            event.clientY
        );

        if (cursorPosition) {
            this.cursorPosition = cursorPosition;
            this.renderAt(cursorPosition);
        }
    }

    private renderAt(cursorPosition: TCursorPosition) {
        this.element.style.top = cursorPosition.y + 'px';
        this.element.style.left = cursorPosition.x + 'px';
    }

    private getCursorPosition(
        clientX: number,
        clientY: number
    ): TCursorPosition | null {
        if (this.parent?.nodeName !== '#text') {
            return null;
        }

        let chars = (this.parent.textContent || '').split('');

        for (let i = 0; i < chars.length; i++) {
            const cursorCoords = this.getCursorCoordsInBounds(
                RangeUtil.getCharRect(this.parent, i) ?? new DOMRect(0, 0, 0, 0),
                clientX,
                clientY
            );

            if (cursorCoords) {
                return {
                    line: 0,
                    col: i,
                    ...cursorCoords
                }
            }
        }

        return null;
    }

    private getCursorCoordsInBounds(
        rect: DOMRect,
        clientX: number,
        clientY: number
    ): TCursorCoordinates | null {
        if (this.isInRectBounds(rect, clientX, clientY)) {
            return this.getCursorCoordsInRect(rect, clientX, clientY);
        }

        return null;
    }

    private getCursorCoordsInRect(
        rect: DOMRect,
        clientX: number,
        clientY: number
    ): TCursorCoordinates {
        return {
            x: this.isCursorBefore(rect, clientX, clientY) ? rect.left: rect.right,
            y: rect.top
        }
    }

    private isCursorBefore(rect: DOMRect, clientX: number, clientY: number) {
        return rect.left <= clientX && (rect.left + rect.width/2) >= clientX;
    }

    private isInRectBounds(rect: DOMRect, clientX: number, clientY: number) {
        const isInVerticalBounds = rect.top < clientY && rect.bottom > clientY;
        const isInHorizontalBounds = rect.left < clientX && rect.right > clientX;

        return isInVerticalBounds && isInHorizontalBounds;
    }

    private createCursorElement() {
        const cursor = document.createElement('div');
        cursor.className = 'TextEditor__cursor';

        return cursor;
    }
}
