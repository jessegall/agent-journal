import time

from controllers.types import Agents, CONTROLLERS, Docs, Reports
from features.base import Feature, event, Line
from resources.base import AGENT, SYSTEM

SOURCES = (Reports, Docs)
BUILT_ON = ("plan", "doc", "report")


class Became(Feature):
    name = "became"
    lines = {"uncited": Line("{{type}} {{n}} cites nothing it was built on", 'you read {{read}} just now: journal {{type}} link {{n}} "<ref>" for whichever it came from')}
    title_ = "Where a plan came from"
    abstract_ = "A plan, doc or report that cites nothing it was built on is named back to the agent"
    help_ = "A plan, doc or report created soon after the agent read a report or doc, and citing none of them, earns a private nudge naming the link to make. became.within (minutes, 30) is how recently it must have read one."
    WITHIN = "within"
    within = 30

    def lately(self, record) -> list:
        since = time.time() - self.setting(record, self.WITHIN, self.within) * 60
        return [r for kind in SOURCES for r in kind(record, actor=SYSTEM)._every()
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
        agent = Agents(record, actor=SYSTEM).primary()
        if not agent:
            return
        names = ", ".join(r.ref for r in uncited[-3:])
        self.say(record, agent, "uncited", private=True, type=event.type, n=event.n, read=names)
