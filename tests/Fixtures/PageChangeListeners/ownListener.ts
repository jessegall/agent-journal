// A module that listens for page changes itself, which only the live transport may do.
export const listened = (channel: { listen: (event: string, then: () => void) => void }) => channel.listen('.page.changed', () => undefined);
export const plain = (channel: { listen: (event: string, then: () => void) => void }) => channel.listen("page.changed", () => undefined);
export const other = (channel: { listen: (event: string, then: () => void) => void }) => channel.listen('.notifications.changed', () => undefined);
