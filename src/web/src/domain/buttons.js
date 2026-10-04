export const allButtons = (row) => (Array.isArray(row.data.buttons) ? row.data.buttons : []);

export const pressedLabels = (row) => [].concat(row.data.pressed || []);

function usedAmong(buttons, pressed, button) {
    const chosen = new Set(buttons.filter((b) => b.choice && pressed.includes(b.label)).map((b) => b.choice));
    return (!button.again && pressed.includes(button.label)) || Boolean(button.choice && chosen.has(button.choice));
}

export const spent = (row, button) => usedAmong(allButtons(row), pressedLabels(row), button);

export const unpressed = (buttons, pressed) => buttons.filter((b) => !usedAmong(buttons, pressed, b));

export const liveButtons = (row) => unpressed(allButtons(row), pressedLabels(row));
