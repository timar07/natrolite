interface Editable {
    /**
     * @description Removes string starting from `startOffset` to `endOffset`
     */
    removeString(startOffset: number, endOffset: number): void;

    /**
     * @description Inserts string at specific offset
     */
    insertString(offset: number, str: string): void;
}
