const CONTROL = 'button, [role="button"], [role="switch"], [role="menuitem"]';

let pressed = null;

export function watchPresses() {
    document.addEventListener(
        "click",
        (event) => {
            const control = event.target.closest?.(CONTROL);
            if (!control) return;
            pressed = control;
            setTimeout(() => {
                if (pressed === control) pressed = null;
            }, 0);
        },
        true
    );
}

export function holdPressed() {
    const control = pressed;
    if (!control) return () => {};
    control.dataset.busy = Number(control.dataset.busy || 0) + 1;
    return () => {
        const left = Number(control.dataset.busy) - 1;
        if (left > 0) control.dataset.busy = left;
        else delete control.dataset.busy;
    };
}
