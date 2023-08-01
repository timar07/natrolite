import VisualPosition from "./visualPosition";

export interface VisualRange {
    getStart(): VisualPosition;
    getEnd(): VisualPosition;
    toString(): string;
}

export class SelectionRange {
    constructor(
        private start: VisualPosition,
        private end: VisualPosition
    ) {}

    public getStart() { return this.start; }
    public getEnd() { return this.end; }
    public toString() {
        return `[${this.start.toString()}, ${this.end.toString()}]`
    }
}

export class InlineRange implements VisualRange {
    private start;
    private end;

    constructor(
        line: number,
        start: number,
        end: number
    ) {
        this.start = new VisualPosition(line, start)
        this.end = new VisualPosition(line, end);
    }

    public getStart() { return this.start; }
    public getEnd() { return this.end; }
    public toString() {
        return `[${this.start.toString()}, ${this.end.toString()}]`
    }
}
