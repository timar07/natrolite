type TCursorAbsolutePosition = {
    x: number,
    y: number
};

export default class CursorState {
    private absolutePosition: TCursorAbsolutePosition;
    private rect: DOMRect = new DOMRect(0, 0, 0, 0);
    public isMouseDown: boolean = false;

    constructor() {
        this.absolutePosition = {
            x: 0,
            y: 0
        };
    }

    getRect() {
        return this.rect;
    }

    getAbsolutePosition() {
        return this.absolutePosition;
    }

    setFromRect(rect: DOMRect | null) {
        this.absolutePosition =
            rect
            ? {
                x: rect.left,
                y: rect.top
            }
            : this.absolutePosition;
        this.rect = rect ?? this.rect;
    }
}
