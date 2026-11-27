/**
 * Whether the key was pressed by itself, with no Control, Command or Option held, so a letter acts as a shortcut.
 */
export function isPlainKey(event: KeyboardEvent, key: string): boolean {
    return event.key.toLowerCase() === key && !event.ctrlKey && !event.metaKey && !event.altKey;
}
