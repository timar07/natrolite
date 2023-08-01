export default class VisualPosition {
    constructor(
        private line: number,
        private col: number
    ) {}

    public toString() {
        return `${this.getLine()}:${this.getCol()}`;
    }

    public getLine() { return this.line; }
    public getCol() { return this.col }
}
