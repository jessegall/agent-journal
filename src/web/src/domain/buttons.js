export const allButtons = (row) => (Array.isArray(row.data.buttons) ? row.data.buttons : []);

export const pressedLabels = (row) => [].concat(row.data.pressed || []);

export function spent(row, button) {
    const pressed = pressedLabels(row);
    const chosen = new Set(allButtons(row).filter((b) => b.choice && pressed.includes(b.label)).map((b) => b.choice));
    return (!button.again && pressed.includes(button.label)) || Boolean(button.choice && chosen.has(button.choice));
}

export const liveButtons = (row) => allButtons(row).filter((b) => !spent(row, b));
