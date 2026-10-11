from engine.record import Record

RECALLED = {"rule": "rules", "fact": "facts", "reminder": "reminders"}
MARKED = {"terminal": "commands", "branch": "commits", "list": "sequences", "bolt": "triggers"}
TURNS = {"thought": "thoughts", "skill": "skills", "subagent": "subagents", "compacted": "compactions", "made": "made", "receipt": "filed", "visitor": "visitors"}
SETTING = "chat_hidden"
SEQUENCES = "sequences"
SEQUENCE_STEPS = "sequence_steps"
DEFAULT_HIDDEN = ["acknowledgements", SEQUENCE_STEPS]


def hidden(home: Record) -> list[str]:
    return home.viewer.get(SETTING, DEFAULT_HIDDEN)


def card_shows(card: dict) -> str:
    """The chat kind a card belongs to: the one it names, else what its icon marks, else a notice; a plugin's own card names its kind, so a card is never a plugin note by carrying a name."""
    if card.get("kind") is not None:
        return card["kind"]
    return MARKED.get(card.get("icon"), "notes")


def whisper_shows(whisper: dict) -> str:
    return RECALLED.get(whisper["ref"].split(":")[0], "rules")


def stamped(data: dict) -> dict:
    """An agent's cards and whispers each carrying the chat kind they show under, so the phone and the desktop read one answer."""
    return {"cards": [{**card, "shows": card_shows(card)} for card in data.get("cards") or []],
            "whispers": [{**whisper, "shows": whisper_shows(whisper)} for whisper in data.get("whispers") or []]}
