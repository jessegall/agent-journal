import time

from controllers.types import CONTROLLERS, Docs, Messages, Reports
from features.base import Feature, event
from resources.base import AGENT, SYSTEM

SOURCES = (Reports, Docs)
BUILT_ON = ("plan", "doc", "report")


class Became(Feature):
    name = "became"
    title_ = "Where a row came from"
    abstract_ = "A row the agent files while a message is in its hands is linked to that message, and a plan or doc that cites nothing it was built on is named back to it"
    help_ = "The message the agent read last and has not closed is the one in hand; every to-do, pin, rule, reminder, question, doc, report, plan or work it creates meanwhile is linked to it and shows as a pill on the turn. A plan, doc or report created soon after the agent read a report or doc, and citing none of them, earns a private nudge naming the link to make. became.within (minutes, 30) is how recently it must have read one."
    WITHIN = "within"
    within = 30

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

    def lately(self, record) -> list:
        since = time.time() - record.setting(self.name, {}).get(self.WITHIN, self.within) * 60
        return [r for kind in SOURCES for r in kind(record, actor=SYSTEM).all()
                if AGENT in r.seen and not r.deleted and r.updated >= since]

    @event("plan.created")
    @event("doc.created")
    @event("report.created")
    def sourced(self, event, record) -> None:
        if event.actor != AGENT or event.type not in BUILT_ON:
            return
        made = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        uncited = [r for r in self.lately(record) if r.ref != made.ref and r.ref not in made.refs]
        if not uncited:
            return
        agent = self.agent(event, record)
        names = ", ".join(r.ref for r in uncited[-3:])
        self.nudge(record, agent, f"{event.type} {event.n} cites nothing it was built on",
                   f"you read {names} just now: journal {event.type} link {event.n} \"<ref>\" for whichever it came from", private=True)
