export class QuietStream {
    static CLOSED = 2;
    static open = new Set();

    constructor() {
        this.readyState = 1;
        this.onmessage = null;
        this.onerror = null;
        QuietStream.open.add(this);
    }

    static tell(data) {
        QuietStream.open.forEach((stream) => stream.onmessage && stream.onmessage({data}));
    }

    close() {
        this.readyState = QuietStream.CLOSED;
        QuietStream.open.delete(this);
    }
}
