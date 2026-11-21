/**
 * A new request id in the ULID shape the journal checks: the time in milliseconds, then randomness, in Crockford's
 * base 32. A form makes one when it opens, so pressing submit twice repeats the same request.
 */
const alphabet = '0123456789abcdefghjkmnpqrstvwxyz';

export function newRequestId(): string {
    let time = Date.now();
    let head = '';

    for (let place = 0; place < 10; place++) {
        head = alphabet[time % 32] + head;
        time = Math.floor(time / 32);
    }

    const random = crypto.getRandomValues(new Uint8Array(16));

    return head + Array.from(random, (byte) => alphabet[byte % 32]).join('');
}
