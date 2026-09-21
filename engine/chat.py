import time

from engine import bus
from engine.bus import Event
from resources.base import AGENT

SENDING, SENT = "message.sending", "message.sent"


def said(record, row, text: str) -> None:
    data = {"text": text, "stopped": False}
    bus.run(Event(id=0, at=time.time(), type="agent", n=row.n, action=SENDING, actor=AGENT, data=data), record)
    if data["stopped"] or not str(data["text"]).strip():
        return
    bus.emit(Event(id=0, at=time.time(), type="agent", n=row.n, action=SENT, actor=AGENT, data={"text": data["text"]}), record)
