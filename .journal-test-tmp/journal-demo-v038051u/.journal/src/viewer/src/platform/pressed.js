let pressed = null;

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
