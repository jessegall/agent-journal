from engine.record import Record
from features.chat_kinds import MARKED, RECALLED

SETTING = "chat_hidden"
DEFAULT_HIDDEN = ["acknowledgements"]


def hidden(home: Record) -> list[str]:
    return home.viewer.get(SETTING, DEFAULT_HIDDEN)


def card_shows(icon: str | None, plugin: str | None) -> str:
    return "plugins" if plugin else MARKED.get(icon, "notes")


def whisper_shows(ref: str) -> str:
    return RECALLED.get(ref.split(":")[0], "rules")
