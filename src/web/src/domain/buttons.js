// The buttons on a message's card, each a label and the path it posts to, and the labels already pressed.
export const allButtons = (message) => (Array.isArray(message.data?.buttons) ? message.data.buttons : []);

export const pressedLabels = (message) => [].concat(message.data?.pressed || []);
