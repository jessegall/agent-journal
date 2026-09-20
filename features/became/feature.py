from controllers.types import Messages
from features.base import Feature, event
from resources.base import AGENT, SYSTEM


class Became(Feature):
    name = "became"
    title_ = "Message tracing"
    abstract_ = "A row the agent files while a message is in its hands is linked to that message, without a declaration"
    help_ = "The message the agent read last and has not closed is the one in hand; every to-do, pin, rule, reminder, question, doc, report, plan or work it creates meanwhile is linked to it and shows as a pill on the turn."

    def in_hand(self, record):
        messages = Messages(record, actor=SYSTEM)
        held = [m for m in messages.all() if AGENT in m.seen and not m.completed and m.seen[0] != AGENT]
        return (messages, held[-1]) if held else (messages, None)

    @event("created")
    def link(self, event, record) -> None:
        if event.actor != AGENT or event.type in ("message", "comment", "reaction", "nudge", "notification", "agent"):
            return
        messages, message = self.in_hand(record)
        if message and event.ref not in message.refs:
            messages.link(message.n, event.ref)
