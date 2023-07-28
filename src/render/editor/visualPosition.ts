export class VisualPosition {
    constructor(
        private line: number,
        private col: number
    ) {}

    public getLine() { return this.line; }
    public getCol() { return this.col }
}
