import time
from uuid import uuid4

from engine import bus
from engine.bus import Event
from resources.base import AGENT

SENDING, SENT = "message.sending", "message.sent"


def send(record, row, text: str, turn: str | None = None) -> None:
    data = {"text": text, "stopped": False, "turn": uuid4().hex if turn is None else f"agent:{row.n}:{turn}"}
    bus.run(Event(id=0, at=time.time(), type="agent", n=row.n, action=SENDING, actor=AGENT, data=data), record)
    if data["stopped"] or not str(data["text"]).strip():
        return
    bus.announce(record, "agent", row.n, SENT, AGENT, {"text": data["text"], "turn": data["turn"]})
