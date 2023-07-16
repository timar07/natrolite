export interface IMoveOperation {
    getMoveMatrix(): [number, number];
}

export class MoveLeft implements IMoveOperation {
    getMoveMatrix(): [number, number] {
        return [-1, 0];
    }

}

export class MoveRight implements IMoveOperation {
    getMoveMatrix(): [number, number] {
        return [1, 0];
    }
}

export class MoveDown implements IMoveOperation {
    getMoveMatrix(): [number, number] {
        return [0, 1];
    }
}

export class MoveUp implements IMoveOperation {
    getMoveMatrix(): [number, number] {
        return [0, -1];
    }
}

export class NoMove implements IMoveOperation {
    getMoveMatrix(): [number, number] {
        return [0, 0];
    }
}

export class CarriageReturn implements IMoveOperation {
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
