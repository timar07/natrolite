import { VisualPosition } from "./visualPosition";

export class DocumentProcessor implements Editable {
    private state = '';
    public onChange?: (ev: DocumentEvent) => void;

    /**
     * @throws {InvalidOffset} if offset is larger then document length
     */
    public insertString(offset: number, str: string) {
        this.assertValidOffset(offset);
        this.state = this.state.slice(0, offset) + str + this.state.slice(offset);
        this.onChange?.(new DocumentEvent(this, offset, offset, str));
    }

    /**
     * @throws {InvalidOffset} if either `startOffset` of `endOffset` is larger
     * then document length
     */
    public removeString(startOffset: number, endOffset: number) {
        this.assertValidOffset(startOffset);
        this.assertValidOffset(endOffset);
        this.state = this.state.slice(0, startOffset) + this.state.slice(endOffset);
        this.onChange?.(new DocumentEvent(this, startOffset, endOffset, ''));
    }

    /**
     * @throws {InvalidOffset}
     */
    public getOffsetFromVisualPosition(pos: VisualPosition) { // TODO: Cache
        let line = 0;
        let col = 0;
        let offset = 0;

        for (; offset < this.state.length; offset++) {
            if (line == pos.getLine() && col == pos.getCol()) {
                break;
            }

            if (this.state[offset] == '\n') {
                line++;
                col = 0;
            }

            col++;
        }

        return offset;
    }

    /**
     * @throws {InvalidOffset}
     */
    public getVisualPositionFromOffset(offset: number) { // TODO: Cache
        this.assertValidOffset(offset);
        let line = 0;
        let col = 0;

        for (let i = 0; i < this.state.length; i++) {
            if (this.state[i] == '\n') {
                line++;
                col = 0;
            } else {
                col++;
            }
        }

        return new VisualPosition(line, col);
    }

    private assertValidOffset(offset: number) {
        if (offset > this.state.length) {
            throw new InvalidOffset(offset);
        }
    }
}

export class DocumentEvent {
    constructor(
        readonly document: DocumentProcessor,
        readonly startOffset: number,
        readonly endOffset: number,
        readonly str: string
    ) {
    }
}

class InvalidOffset extends Error {
    constructor(offset: number) {
        super('Invalid offset: ' + offset);
    }
}
