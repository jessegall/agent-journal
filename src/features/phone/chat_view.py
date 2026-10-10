from engine.record import Record

RECALLED = {"rule": "rules", "fact": "facts", "reminder": "reminders"}
MARKED = {"terminal": "commands", "branch": "commits", "list": "sequences", "bolt": "triggers"}
SETTING = "chat_hidden"
DEFAULT_HIDDEN = ["acknowledgements", "sequences"]


def hidden(home: Record) -> list[str]:
    return home.viewer.get(SETTING, DEFAULT_HIDDEN)


def card_shows(icon: str | None, plugin: str | None) -> str:
    return "plugins" if plugin else MARKED.get(icon, "notes")


def whisper_shows(ref: str) -> str:
    return RECALLED.get(ref.split(":")[0], "rules")
