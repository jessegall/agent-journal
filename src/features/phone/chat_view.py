from engine.record import Record

TURNS = {"thought": "thoughts", "skill": "skills", "subagent": "subagents", "compacted": "compactions", "made": "made", "receipt": "filed", "visitor": "visitors"}
SETTING = "chat_hidden"
SEQUENCES = "sequences"
SEQUENCE_STEPS = "sequence_steps"
DEFAULT_HIDDEN = ["acknowledgements", SEQUENCE_STEPS]


def hidden(home: Record) -> list[str]:
    return home.viewer.get(SETTING, DEFAULT_HIDDEN)
