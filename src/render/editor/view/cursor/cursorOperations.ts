import { Command } from "../../core/command";
import Cursor from "./cursor";

export interface MoveOperation extends Command<Cursor> {
    getMoveMatrix(): [number, number];
}

export namespace CursorOperations {

export class MoveLeft implements MoveOperation {
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
        return [-1 * this.times, 0];
    }
}

export class MoveRight implements MoveOperation {
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

export class MoveDown implements MoveOperation {
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

export class MoveUp implements MoveOperation {
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

export class NoMove implements MoveOperation {
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

export class CarriageReturn implements MoveOperation {
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
