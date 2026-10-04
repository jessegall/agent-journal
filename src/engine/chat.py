import time
from uuid import uuid4

from engine import bus
from engine.bus import Event
from resources.base import AGENT

SENDING, SENT = "message.sending", "message.sent"


def send(record, row, text: str, turn: str = "") -> None:
    data = {"text": text, "stopped": False, "turn": turn or uuid4().hex}
    bus.run(Event(id=0, at=time.time(), type="agent", n=row.n, action=SENDING, actor=AGENT, data=data), record)
    if data["stopped"] or not str(data["text"]).strip():
        return
    bus.emit(Event(id=0, at=time.time(), type="agent", n=row.n, action=SENT, actor=AGENT, data={"text": data["text"], "turn": data["turn"]}), record)
