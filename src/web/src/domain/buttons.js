export const allButtons = (row) => (Array.isArray(row.data.buttons) ? row.data.buttons : []);

export const pressedLabels = (row) => [].concat(row.data.pressed || []);

function usedAmong(buttons, pressed, button) {
    const chosen = new Set(buttons.filter((b) => b.choice && pressed.includes(b.label)).map((b) => b.choice));
    return (!button.again && pressed.includes(button.label)) || Boolean(button.choice && chosen.has(button.choice));
}

export const spent = (row, button) => usedAmong(allButtons(row), pressedLabels(row), button);

export const unpressed = (buttons, pressed) => buttons.filter((b) => !usedAmong(buttons, pressed, b));

export const liveButtons = (row) => unpressed(allButtons(row), pressedLabels(row));

const pickOf = (row) => allButtons(row)[Number(row.data.pick) - 1] || null;

export function choiceGroups(row) {
    const buttons = allButtons(row).filter((b) => b.choice);
    const pressed = pressedLabels(row);
    return [...new Set(buttons.map((b) => b.choice))].map((choice) => {
        const own = buttons.filter((b) => b.choice === choice);
        return {
            choice,
            buttons: own,
            ask: own.find((b) => b.ask)?.ask || "Choose one",
            pick: pickOf(row),
            chosen: own.find((b) => pressed.includes(b.label)) || null,
        };
    });
}

export const unanswered = (row) => !row.data.answered_own && choiceGroups(row).some((group) => !group.chosen);

export const doing = (button) => `${button.action.replaceAll("_", " ")} ${button.type}${button.n ? ` ${button.n}` : ""}`;
