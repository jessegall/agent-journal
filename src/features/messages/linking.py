from engine.events.resources import ResourceCreated
from features.messages.answering import in_hand
from features.parts import Context, Handler
from resources.base import AGENT
from controllers.types import Messages

RECENT = 200
LINKED = ("message", "comment", "reaction", "nudge", "notification", "agent")


def filed(context: Context, message) -> None:
    events = context.record.event_log.events(last=RECENT)
    read = max((e.at for e in events if e.type == "message" and e.data.get("seen") == AGENT and message.n in (e.data.get("numbers") or [e.n])), default=0.0)
    claimed = {e.data.get("to") for e in events if e.type == "message" and e.action == "linked" and not e.data.get("off")}
    for e in events:
        ref = f"{e.type}:{e.n}"
        if read and e.at >= read and e.action == "created" and e.actor == AGENT and e.type not in LINKED and ref not in claimed | set(message.refs):
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
