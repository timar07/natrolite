import RangeUtil from "../rangeUtil";
import CursorState from "./cursorState";

interface ICursorEventHandler {
    handle(event: Event, state: CursorState): void;
}

export class MouseDown implements ICursorEventHandler {
    handle(event: MouseEvent, state: CursorState): void {
        state.setFromRect(this.getClickedRect(event));
    }

    protected getClickedRect(event: MouseEvent) {
        // @ts-ignore
        const target = event.target?.childNodes[0];
        const chars = (target.textContent || '').split('');

        for (let i = 0; i < chars.length; i++) {
            const rect = RangeUtil.getCharRect(target, i);

            if (this.isInRectBounds(rect, event.clientX, event.clientY)) {
                return rect;
            }
        }

        return null;
    }

    private isInRectBounds(rect: DOMRect | undefined, clientX: number, clientY: number) {
        if (!rect) return false;
        const isInVerticalBounds = rect.top < clientY && rect.bottom > clientY;
        const isInHorizontalBounds = rect.left < clientX && rect.right > clientX;
        return isInVerticalBounds && isInHorizontalBounds;
    }
}

export class MouseMove extends MouseDown {
    handle(event: MouseEvent, state: CursorState): void {
        if (state.isMouseDown) {
            state.setFromRect(this.getClickedRect(event));
        }
    }
}
