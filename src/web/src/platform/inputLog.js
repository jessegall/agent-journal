// Every input to a field and every write to a field's value by code, printed to the console: the hand that wipes a field shows itself here.
const EVENTS = ["keydown", "beforeinput", "input", "paste", "focus", "blur"];
const FIELDS = ["INPUT", "TEXTAREA"];

function nameOf(field) {
    const tag = field.tagName.toLowerCase();
    const id = field.id ? `#${field.id}` : "";
    const classes = field.className && typeof field.className === "string" ? `.${field.className.trim().split(/\s+/).join(".")}` : "";
    const placeholder = field.placeholder ? ` "${field.placeholder}"` : "";
    return `${tag}${id}${classes}${placeholder}`;
}

function shown(value) {
    const text = String(value ?? "");
    return JSON.stringify(text.length > 80 ? `${text.slice(0, 80)}…(${text.length})` : text);
}

function detail(event) {
    if (event.type === "keydown") {
        const keys = [event.metaKey && "Meta", event.ctrlKey && "Ctrl", event.altKey && "Alt", event.shiftKey && "Shift", event.key].filter(
            Boolean
        );
        return keys.join("+");
    }
    if (event.type === "beforeinput" || event.type === "input") return `${event.inputType || ""} ${shown(event.data)}`;
    if (event.type === "paste") return shown(event.clipboardData ? event.clipboardData.getData("text") : "");
    return "";
}

function isField(target) {
    return target && (FIELDS.includes(target.tagName) || target.isContentEditable);
}

function logEvent(event) {
    if (!isField(event.target)) return;
    const field = event.target;
    const value = field.isContentEditable ? field.textContent : field.value;
    console.log(`[input] ${event.type} ${nameOf(field)} ${detail(event)} value=${shown(value)}`);
}

function where() {
    const stack = (new Error().stack || "")
        .split("\n")
        .slice(3, 7)
        .map((line) => line.trim());
    return stack.join(" ← ");
}

function watchValue(prototype) {
    const own = Object.getOwnPropertyDescriptor(prototype, "value");
    if (!own || !own.set) return;
    Object.defineProperty(prototype, "value", {
        configurable: true,
        enumerable: own.enumerable,
        get() {
            return own.get.call(this);
        },
        set(next) {
            const before = own.get.call(this);
            own.set.call(this, next);
            if (String(before) !== String(next ?? "") && this.isConnected) {
                console.log(`[input] code set ${nameOf(this)} from ${shown(before)} to ${shown(next)} at ${where()}`);
            }
        },
    });
}

export function logInputs(win = window) {
    for (const type of EVENTS) win.addEventListener(type, logEvent, true);
    win.document.addEventListener("visibilitychange", () => console.log(`[input] visibility ${win.document.visibilityState}`), true);
    win.addEventListener("focus", () => console.log("[input] window focus"), true);
    win.addEventListener("blur", () => console.log("[input] window blur"), true);
    watchValue(win.HTMLInputElement.prototype);
    watchValue(win.HTMLTextAreaElement.prototype);
}
