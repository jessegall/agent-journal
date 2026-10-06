const [web, env, wanted] = process.argv.slice(2);
globalThis.window = globalThis;
globalThis.location = new URL(`http://127.0.0.1/${env}/`);
globalThis.localStorage = {getItem: () => null, setItem() {}, removeItem() {}};
globalThis.history = {pushState() {}, replaceState() {}, state: null};
globalThis.addEventListener = () => {};

const {ApiClient} = await import(`${web}/api/client.js`);
const {transport} = await import(`${web}/api/transport.js`);

let sent = [];
transport.request = (method, url, body = null) => {
    sent.push({method, url, body: body instanceof FormData ? {form: [...body.keys()]} : body});
    return Promise.resolve({});
};

const api = new ApiClient({env: () => env});
const calls = JSON.parse(wanted);
const recorded = {};
for (const [name, args] of Object.entries(calls)) {
    sent = [];
    try {
        await api[name](...args.map((arg) => (arg && arg.file ? new File(["walked"], arg.file) : arg)));
    } catch (error) {
        sent.push({error: String(error)});
    }
    recorded[name] = sent;
}
console.log(JSON.stringify({methods: Object.getOwnPropertyNames(ApiClient.prototype).filter((name) => name !== "constructor"), sent: recorded}));
