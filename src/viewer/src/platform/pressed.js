// The one place a button shows that its request is in flight: a click on any button is noted here, and a request asked
// while that click is handled, read or write (api/transport.js, Transport.held, through holdPressed), puts a spinner on the button and disables it
// until the request ends; a read shows the spinner only after SPINNER_AFTER_MS, so a fast one does not flicker the label, a write at once. No button opts in; a click that sends no request changes nothing. A button that sends its request around the
// transport (its own fetch) is not seen here.
// how long a read may fly before its button shows the spinner; the kit button waits as long for a slow handler
export const SPINNER_AFTER_MS = 120;
const BUTTON = 'button, [role="button"], [role="switch"], [role="menuitem"], a.btn';

// the viewer and the window kit are built apart and each holds a copy of this file, as of the transport, so the state is shared
// by the page: the button just clicked, and the buttons this file disabled (a button disabled by its own window is left as it was)
const press = (globalThis[Symbol.for("journal.pressed")] ??= {control: null, disabledHere: new WeakSet()});

export function watchPresses(root = document) {
    root.addEventListener("click", (event) => {
        const control = event.target instanceof Element ? event.target.closest(BUTTON) : null;
        if (!control) return;
        press.control = control;
        setTimeout(() => {
            if (press.control === control) press.control = null;
        });
    }, true);
}

export function holdPressed(delayMs = 0) {
    const control = press.control;
    if (!control) return () => {};
    let held = false;
    const hold = () => {
        held = true;
        control.dataset.busy = Number(control.dataset.busy || 0) + 1;
        if (!control.disabled) {
            control.disabled = true;
            press.disabledHere.add(control);
        }
    };
    const timer = delayMs ? setTimeout(hold, delayMs) : hold();
    return () => {
        clearTimeout(timer);
        if (!held) return;
        const left = Number(control.dataset.busy) - 1;
        if (left > 0) return void (control.dataset.busy = left);
        delete control.dataset.busy;
        if (press.disabledHere.delete(control)) control.disabled = false;
    };
}
