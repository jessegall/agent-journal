import time
from uuid import uuid4

from engine import bus
from engine.bus import Event
from events.agents import SENDING, SENT, WRITTEN
from events.answers import Kept, Rewritten
from events.asking import AgentMessageSending
from resources.base import AGENT



def send(record, row, text: str, turn: str | None = None) -> None:
    """A turn the agent wrote: what of it reaches the chat is asked first, then the turn is told as written, and only what was let through is told as sent."""
    data = {"text": text, "stopped": False, "turn": uuid4().hex if turn is None else f"agent:{row.n}:{turn}"}
    answer = bus.asked(AgentMessageSending(text=text, turn=data["turn"], session=row.title), record)
    data["stopped"] = isinstance(answer, Kept)
    data["text"] = answer.text if isinstance(answer, Rewritten) else text
    bus.run(Event(id=0, at=time.time(), type="agent", n=row.n, action=SENDING, actor=AGENT, data=data), record)
    bus.announce(record, "agent", row.n, WRITTEN, AGENT, {"text": text, "turn": data["turn"]})
    if data["stopped"] or not str(data["text"]).strip():
        return
    bus.announce(record, "agent", row.n, SENT, AGENT, {"text": data["text"], "turn": data["turn"]})
