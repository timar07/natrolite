import VisualPosition from "./visualPosition";

export class DocumentProcessor {
    public state: string = '';
    public onChange?: (ev: DocumentEvent) => void;

    public setState(initialState: string) {
        this.insertString(0, initialState);
    }

    /**
     * Inserts string at specific offset
     * @throws {InvalidOffset} if offset is larger then document length
     */
    public insertString(offset: number, str: string) {
        this.assertValidOffset(offset);
        this.onChange?.(new DocumentEvent(offset, offset, str));
        this.state = this.state.slice(0, offset) + str + this.state.slice(offset);
        console.log(this.state);
    }

    /**
     * Removes string starting from `startOffset` to `endOffset`
     * @throws {InvalidOffset} if either `startOffset` or `endOffset` is larger
     * then document length
     */
    public removeString(startOffset: number, endOffset: number) {
        this.assertValidOffset(startOffset);
        this.assertValidOffset(endOffset);
        this.onChange?.(new DocumentEvent(startOffset, endOffset, ''));
        this.state = this.state.slice(0, startOffset) + this.state.slice(endOffset);
        console.log(this.state);
    }

    /**
     * @throws {Error} if position does not exist in document
     */
    public getOffsetFromVisualPosition(pos: VisualPosition) { // TODO: Cache
        let line = 0;
        let col = 0;
        let offset = 0;

        for (; offset <= this.state.length; offset++, col++) {
            if (line == pos.getLine() && col == pos.getCol()) {
                return offset;
            }

            if (this.state[offset] == '\n') {
                line++;
                col = -1; // only first nonspace symbol has index of zero
            }
        }

        throw new Error(`VisualPosition ${pos.toString()} does not exist in document`);
    }

    /**
     * @throws {InvalidOffset}
     */
    public getVisualPositionFromOffset(offset: number) { // TODO: Cache
        this.assertValidOffset(offset);
        let line = 0;
        let col = 0;

        for (let i = 0; i < offset; i++, col++) {
            if (this.state[i] === '\n') {
                line++;
                col = -1;
            }
        }

        return new VisualPosition(line, col);
    }

    private assertValidOffset(offset: number) {
        if (offset > this.state.length + 1) {
            throw new InvalidOffset(offset);
        }
    }
}

export class DocumentEvent {
    constructor(
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
