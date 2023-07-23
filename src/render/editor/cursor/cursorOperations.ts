import { ICommand } from "../editor/editor";
import Cursor from "./cursor";

export interface IMoveOperation extends ICommand<Cursor> {
    getMoveMatrix(): [number, number];
}

export namespace CursorOperations {

export class MoveLeft implements IMoveOperation {
    constructor(
        private times: number = 1
    ) {}

    execute(receiver: Cursor): void {
        receiver.handleOperation(this);
    }

    undo(): void {
        throw new Error("Method not implemented.");
    }

    getMoveMatrix(): [number, number] {
        return [-1, 0];
    }
}

export class MoveRight implements IMoveOperation {
    constructor(
        private times: number = 1
    ) {}

    execute(receiver: Cursor): void {
        receiver.handleOperation(this);
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [1 * this.times, 0];
    }
}

export class MoveDown implements IMoveOperation {
    execute(receiver: Cursor): void {
        receiver.handleOperation(this);
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
        receiver.handleOperation(this);
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [0, -1];
    }
}

export class NoMove implements IMoveOperation {
    execute(receiver: Cursor): void {
        receiver.handleOperation(this);
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
        receiver.handleOperation(this);
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    getMoveMatrix(): [number, number] {
        return [-Infinity, 0];
    }
}

} // namespace CursorOperations
