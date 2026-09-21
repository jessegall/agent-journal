import time

from engine.events import ResourceCreated
from features.parts import Context, Handler
from resources.base import AGENT

BUILT_ON = ("plan", "doc", "report")
SOURCES = ("reports", "docs")


class NameUncitedSource(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.actor != AGENT or event.type not in BUILT_ON:
            return
        made = context.journal.of(event.type).load(event.n)
        uncited = [r for r in self.lately(context) if r.ref != made.ref and r.ref not in made.refs]
        agent = context.journal.agents.primary()
        if uncited and agent:
            context.speaking_to(agent).agent.whisper("uncited", type=event.type, n=event.n, read=", ".join(r.ref for r in uncited[-3:]))

    def lately(self, context: Context) -> list:
        since = time.time() - context.settings.within * 60
        return [r for kind in SOURCES for r in getattr(context.journal, kind)._every() if AGENT in r.seen and not r.deleted and r.updated >= since]
