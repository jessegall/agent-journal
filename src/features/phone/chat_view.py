from engine.record import Record

RECALLED = {"rule": "rules", "fact": "facts", "reminder": "reminders"}
MARKED = {"terminal": "commands", "branch": "commits", "list": "sequences", "bolt": "triggers"}
SETTING = "chat_hidden"
SEQUENCES = "sequences"
SEQUENCE_STEPS = "sequence_steps"
DEFAULT_HIDDEN = ["acknowledgements", SEQUENCE_STEPS]


def hidden(home: Record) -> list[str]:
    return home.viewer.get(SETTING, DEFAULT_HIDDEN)


def card_shows(icon: str | None, plugin: str | None, kind: str | None) -> str:
    """The chat kind a card belongs to: the one it names, else what its icon marks."""
    if kind is not None:
        return kind
    return "plugins" if plugin else MARKED.get(icon, "notes")


def whisper_shows(ref: str) -> str:
    return RECALLED.get(ref.split(":")[0], "rules")
