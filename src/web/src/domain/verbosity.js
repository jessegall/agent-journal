export const LEVELS = [
    {value: "commands", label: "Commands", icon: "terminal"},
    {value: "journal", label: "Commands and journal", icon: "book"},
    {value: "everything", label: "Everything", icon: "list"},
];

export const DEFAULT_LEVEL = "everything";

export const levelOf = (pane) => (pane && pane.verbosity) || DEFAULT_LEVEL;

export const levelChoices = (pane) => LEVELS.map((l) => ({...l, current: l.value === levelOf(pane)}));
