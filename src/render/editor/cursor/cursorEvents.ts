import RangeUtil from "../rangeUtil";
import CursorState from "./cursorState";

interface ICursorEventHandler {
    handle(event: Event, state: CursorState): void;
}

export class MouseDown implements ICursorEventHandler {
    handle(event: MouseEvent, state: CursorState): void {
        if (this.isOutsideOfText(event)) {
            const target = event.target as HTMLElement;
            const rect = RangeUtil.getCharRect(
                target.childNodes[0],
                (target.textContent?.length || 1) - 1
            );
            state.setFromRect(rect);
            return;
        }

        state.setFromRect(this.getClickedRect(event));
    }

    private isOutsideOfText(event: MouseEvent) {
        return event.offsetX >= RangeUtil.measureText(event.target as Node).width
    }

    protected getClickedRect(event: MouseEvent) {
        // @ts-ignore
        const target = event.target?.childNodes[0];
        const chars = (target.textContent || '').split('');

        for (let i = 0; i < chars.length; i++) {
            const rect = RangeUtil.getCharRect(target, i);

            if (this.isInRectBounds(rect, event.clientX, event.clientY)) {
                if (this.isCursorBefore(rect, event.clientX, event.clientY)) {
                    return rect
                }

               return new DOMRect(
                    rect.x + rect.width,
                    rect.y,
                    rect.width,
                    rect.height
               );
            }
        }

        return null;
    }

    private isCursorBefore(rect: DOMRect, clientX: number, clientY: number) {
        return rect.left <= clientX && (rect.left + rect.width/2) >= clientX;
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
