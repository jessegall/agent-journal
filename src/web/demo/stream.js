export class QuietStream {
    static CLOSED = 2;

    constructor() {
        this.readyState = 1;
        this.onmessage = null;
        this.onerror = null;
    }

    close() {
        this.readyState = QuietStream.CLOSED;
    }
}
