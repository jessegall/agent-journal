from engine.events.resources import ResourceCreated
from features.messages.answering import in_hand
from features.parts import Context, Handler
from resources.base import AGENT
from controllers.types import Messages

RECENT = 200
LINKED = ("message", "comment", "reaction", "nudge", "notification", "agent")


def read_numbers(e) -> list[int]:
    return e.data.get("numbers") or [e.n]


def held_at(events: list, at: float) -> set[int]:
    read = {n for e in events if e.type == "message" and e.data.get("seen") == AGENT and e.at <= at for n in read_numbers(e)}
    closed = {e.n for e in events if e.type == "message" and e.action == "completed" and e.at <= at}
    return read - closed


def filed(context: Context, message) -> None:
    events = context.record.event_log.events(last=RECENT)
    claimed = {e.data.get("to") for e in events if e.type == "message" and e.action == "linked" and not e.data.get("off")}
    for e in events:
        ref = f"{e.type}:{e.n}"
        if e.action != "created" or e.actor != AGENT or e.type in LINKED or ref in claimed | set(message.refs):
            continue
        if held_at(events, e.at) == {message.n}:
            context.journal.get(Messages).link(message.n, ref)


class LinkToMessageInHand(Handler):
    behaviour = "linking"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.actor != AGENT or event.type in LINKED:
            return
        message = in_hand(context.journal)
        ref = f"{event.type}:{event.n}"
        if message and ref not in message.refs:
            context.journal.get(Messages).link(message.n, ref)
