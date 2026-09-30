const HEADERS = {"Content-Type": "application/json", "X-Phone": "1"};

export class PhoneError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function answered(got) {
    const body = await got.json().catch(() => ({}));
    if (!got.ok) throw new PhoneError(got.status, body.error || "Your computer did not answer");
    return body;
}

async function sent(path, body) {
    return answered(await fetch(path, {method: "POST", headers: HEADERS, body: JSON.stringify(body), cache: "no-store"}));
}

export const phone = {
    pair: (code, device) => sent("./pair", {code, device}),
    state: async () => answered(await fetch("./state", {cache: "no-store"})),
    say: (brief, idempotency, about = "") => sent("./message", {brief, idempotency, about}),
};
