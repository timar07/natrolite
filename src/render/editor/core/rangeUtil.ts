export default class RangeUtil {
    public static getCharRect(
        textNode: Node,
        index: number
    ): DOMRect {
        try {
            const range = document.createRange();
            range.setStart(textNode, index);
            range.setEnd(textNode, index+1);
            return range.getClientRects()[0];
        } catch(e) {
            return new DOMRect(0, 0, 0, 0);
        }
    }

    public static measureText(parent: Node) {
        const range = document.createRange();
        range.setStart(parent, 0);
        range.setEnd(parent, 1);
        return range.getClientRects()[0];
    }
}
