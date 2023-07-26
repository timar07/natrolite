export class DocumentProcessor {
    private state = 'Hello, world!';
    public onChange?: (ev: DocumentEvent) => void;

    /**
     * Inserts string at specific offset
     * @throws {InvalidOffset} if offset is larger then document length
     */
    public insertString(offset: number, str: string) {
        if (offset > this.state.length)
            throw new InvalidOffset();

        this.state = this.state.slice(0, offset) + str + this.state.slice(offset);
        this.onChange?.(new Insert(this, str, offset));
    }

    /**
     * Removes string starting from `startOffset` to `endOffset`
     * @throws {InvalidOffset} if either `startOffset` of `endOffset` is larger
     * then document length
     */
    public removeString(startOffset: number, endOffset: number) {
        if (startOffset > this.state.length ||
            endOffset > this.state.length) {
            throw new InvalidOffset();
        }

        this.state = this.state.slice(0, startOffset) + this.state.slice(endOffset);
        this.onChange?.(new Remove(this, startOffset, endOffset));
    }

    public getLineFromOffset(offset: number) { // TODO: Cache
        let lineCounter = 0;

        for (let i in Array.from(this.state.slice(0, offset))) {
            if (i == '\n') lineCounter++;
        }
    }
}

export interface DocumentEvent {
    readonly document: DocumentProcessor,
    readonly startOffset: number;
    readonly endOffset: number;
}

export class Insert implements DocumentEvent {
    readonly endOffset: number;

    constructor(
        readonly document: DocumentProcessor,
        readonly str: string,
        readonly startOffset: number,
    ) {
        this.endOffset = this.startOffset;
    }
}

export class Remove implements DocumentEvent {
    constructor(
        readonly document: DocumentProcessor,
        readonly startOffset: number,
        readonly endOffset: number,
    ) {
    }
}

class InvalidOffset extends Error {}
