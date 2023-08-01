export interface PrimitiveCommand<T> {
    execute(receiver: T): void;
}

export interface Command<T> extends PrimitiveCommand<T> {
    undo(receiver: T): void;
}
