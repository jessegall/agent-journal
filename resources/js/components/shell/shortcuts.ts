/**
 * The keyboard shortcuts the help lists, by group. Each names its keys and what they do.
 */
export type Shortcut = { keys: string[]; does: string };

export const shortcutGroups: { title: string; shortcuts: Shortcut[] }[] = [
    {
        title: 'Anywhere',
        shortcuts: [
            { keys: ['Ctrl', 'K'], does: 'Every command, page and record' },
            { keys: ['?'], does: 'Open this help' },
            { keys: ['Esc'], does: 'Close a dialog, menu or list and return to where you were' },
        ],
    },
    {
        title: 'Menus and lists',
        shortcuts: [
            { keys: ['↑', '↓'], does: 'Move between items' },
            { keys: ['Enter'], does: 'Choose the active item' },
            { keys: ['Menu'], does: 'Open the context menu of the focused item' },
            { keys: ['Shift', 'F10'], does: 'Open the context menu of the focused item' },
        ],
    },
    {
        title: 'Documents',
        shortcuts: [
            { keys: ['↑', '↓'], does: 'Move the line cursor' },
            { keys: ['Shift', '↑', '↓'], does: 'Extend the selected lines' },
            { keys: ['C'], does: 'Comment on the selected lines' },
        ],
    },
    {
        title: 'The desk',
        shortcuts: [
            { keys: ['Alt', '1'], does: 'Bring the project tree forward' },
            { keys: ['Alt', '2'], does: 'Bring the activity feed forward' },
            { keys: ['Alt', '`'], does: 'Go to the next open window' },
            { keys: ['Menu'], does: 'On a window tab: dock, join or move the window' },
            { keys: ['Tab'], does: 'In a terminal window: Leave terminal moves the focus to the window picker' },
        ],
    },
];
