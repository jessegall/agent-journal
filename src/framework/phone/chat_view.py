from engine.record import Record
from resources.chat_view import TURNS
from resources.sequences import SEQUENCE_STEPS

SETTING = "chat_hidden"
DEFAULT_HIDDEN = ["acknowledgements", SEQUENCE_STEPS]


def hidden(home: Record) -> list[str]:
    return home.viewer.get(SETTING, DEFAULT_HIDDEN)
