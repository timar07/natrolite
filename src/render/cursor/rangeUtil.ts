export default class RangeUtil {
    public static getCharRect(
        textNode: Node,
        index: number
    ): DOMRect | null {
        try {
            const range = document.createRange();
            range.setStart(textNode, index);
            range.setEnd(textNode, index+1);
            return range.getClientRects()[0];
        } catch(e) {
            return null;
        }
    }
}