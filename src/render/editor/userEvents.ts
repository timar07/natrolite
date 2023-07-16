// import { ipcRenderer } from 'electron';

export class UserEvents {
    public onKeyPress?: (key: IKeyboardKey) => void;

    constructor() {
        document.onkeydown = (event) => {
            const key = this.handleKey(event)
            // ipcRenderer.send('keypress', key);
        }
    }

    private handleKey(event: KeyboardEvent): IKeyboardKey | undefined {
        event.preventDefault();

        switch (event.key) {
            case 'Backspace':
                return new Backspace();
            case 'Shift':
                return undefined;
            default: {
                return new PrintableCharacter(event.key);
            }
        }
    }
}

new UserEvents();

export interface IKeyboardKey {
    isPrintable(): boolean;
    toString(): string;
}

export class PrintableCharacter implements IKeyboardKey {
    private key;

    constructor(key: string) {
        this.key = key;
    }

    isPrintable() { return true; }
    toString() { return this.key; }
}

export class Backspace implements IKeyboardKey {
    isPrintable() { return false; }
    toString() { return 'Backspace'; }
}
