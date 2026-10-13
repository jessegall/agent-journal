from engine.record import Record
from resources.sequences import SEQUENCE_STEPS

TURNS = {"thought": "thoughts", "skill": "skills", "subagent": "subagents", "compacted": "compactions", "made": "made", "receipt": "filed", "visitor": "visitors"}
SETTING = "chat_hidden"
DEFAULT_HIDDEN = ["acknowledgements", SEQUENCE_STEPS]


def hidden(home: Record) -> list[str]:
    return home.viewer.get(SETTING, DEFAULT_HIDDEN)
