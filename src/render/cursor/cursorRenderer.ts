import "./cursor.css";
import RangeUtil from "./rangeUtil";

export type TCursorPosition =  {
    col: number,
    line: number
};

export type TCursorCoordinates = {
    x: number,
    y: number
};

export default class CursorRenderer {
    private element: HTMLElement;
    private isMouseDown: boolean = false;
    private cursorPosition: TCursorPosition;
    private cursorCoords: TCursorCoordinates;
    private textNode?: Node;

    constructor() {
        this.element = this.createCursorElement();
        this.cursorPosition = {col: 0, line: 0};
        this.cursorCoords = {x: 0, y: 0};
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

    public setToRect(rect: DOMRect, cursorPosition: TCursorPosition) {
        console.log(cursorPosition);
        this.cursorPosition = cursorPosition;

        this.cursorCoords = {
            x: rect.right,
            y: rect.top
        };

        this.renderAt(this.cursorCoords);
    }

    public handleCursorEvent(event: MouseEvent) {
        // @ts-ignore
        this.textNode = event.target.childNodes[0];
        const cursorCoords = this.getCursorCoords(
            event.clientX,
            event.clientY
        );

        if (cursorCoords) {
            this.cursorCoords = cursorCoords;
            this.renderAt(cursorCoords);
        }
    }

    private renderAt(cursorPosition: TCursorCoordinates) {
        this.element.style.top = cursorPosition.y + 'px';
        this.element.style.left = cursorPosition.x + 'px';
    }

    private getCursorCoords(
        clientX: number,
        clientY: number
    ): TCursorCoordinates | null {
        if (this.textNode?.nodeName !== '#text') {
            return null;
        }

        let chars = (this.textNode.textContent || '').split('');

        for (let i = 0; i < chars.length; i++) {
            const cursorCoords = this.getCursorCoordsInBounds(
                RangeUtil.getCharRect(this.textNode, i) ?? new DOMRect(0, 0, 0, 0),
                clientX,
                clientY
            );

            if (cursorCoords) {
                // TODO: Refactoring, line is always 0
                this.cursorPosition = {
                    line: 0,
                    col: i
                };

                return cursorCoords;
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
