import { ICommand } from "../editor/editor";
import Cursor from "./cursor";

export interface IMoveOperation extends ICommand<Cursor> {
    getMoveMatrix(): [number, number];
}

export class MoveLeft implements IMoveOperation {
    execute(receiver: Cursor): void {
        throw new Error("Method not implemented.");
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }

    getMoveMatrix(): [number, number] {
        return [-1, 0];
    }
}

export class MoveRight implements IMoveOperation {
    execute(receiver: Cursor): void {
        throw new Error("Method not implemented.");
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [1, 0];
    }
}

export class MoveDown implements IMoveOperation {
    execute(receiver: Cursor): void {
        throw new Error("Method not implemented.");
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [0, 1];
    }
}

export class MoveUp implements IMoveOperation {
    execute(receiver: Cursor): void {
        throw new Error("Method not implemented.");
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [0, -1];
    }
}

export class MoveEndOfLine implements IMoveOperation {
    execute(receiver: Cursor): void {
        throw new Error("Method not implemented.");
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [Infinity, 0];
    }
}

export class NoMove implements IMoveOperation {
    execute(receiver: Cursor): void {
        throw new Error("Method not implemented.");
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [0, 0];
    }
}

export class CarriageReturn implements IMoveOperation {
    execute(receiver: Cursor): void {
        throw new Error("Method not implemented.");
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [-Infinity, 0];
    }
}

export class CursorOperation {
    static readonly moveLeft = new CursorOperation(
        new MoveLeft()
    );

    static readonly moveRight = new CursorOperation(
        new MoveRight()
    );

    static readonly moveDown = new CursorOperation(
        new MoveDown()
    );

    static readonly moveUp = new CursorOperation(
        new MoveUp()
    );

    static readonly moveEndOfLine = new CursorOperation(
        new MoveEndOfLine()
    );


    static readonly noMove = new CursorOperation(
        new NoMove()
    );

    static readonly carriageReturn = new CursorOperation(
        new CarriageReturn()
    );

    constructor(
        private value: IMoveOperation
    ) {}

    getMoveMatrix() {
        return this.value.getMoveMatrix();
    }
}
