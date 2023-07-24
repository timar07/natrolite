import RangeUtil from "../rangeUtil";
import CursorState from "./cursorState";

interface ICursorEventHandler {
    handle(event: Event, state: CursorState): void;
}

export class MouseDown implements ICursorEventHandler {
    handle(event: MouseEvent, state: CursorState): void {
        state.setFromRect(
            this.isOutsideOfText(event)
            ? this.getLastRect(event.target as HTMLElement)
            : this.getClickedRect(event)
        );
    }

    private getLastRect(target: HTMLElement) {
        return RangeUtil.getCharRect(
            target.childNodes[0],
            (target.textContent?.length || 1) - 1
        );
    }

    private isOutsideOfText(event: MouseEvent) {
        return event.offsetX >= (RangeUtil.measureText(event.target as Node)?.width || 0)
    }

    protected getClickedRect(event: MouseEvent) {
        if (event.target == null || !(event.target instanceof Element))
            return null;

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

    private isCursorBefore(rect: DOMRect, x: number, y: number) {
        return rect.left <= x && (rect.left + rect.width/2) >= x;
    }

    private isInRectBounds(rect: DOMRect | undefined, x: number, y: number) {
        if (!rect) return false;
        const isInVerticalBounds = rect.top < y && rect.bottom > y;
        const isInHorizontalBounds = rect.left < x && rect.right > x;
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
