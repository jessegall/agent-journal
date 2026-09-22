from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.dumps.resource import ITEM
from features.parts import Context, Handler
from resources.base import USER

WRITTEN = ("created", "updated")
FILED = "completed"


@dataclass(frozen=True)
class DumpWritten(ResourceEvent):
    on: ClassVar[str] = "dump"

    def wanted(self) -> bool:
        return self.action == FILED or (self.action in WRITTEN and self.actor == USER)


class PromptFiling(Handler):
    def handle(self, context: Context, event: DumpWritten) -> None:
        dumps, agent = context.journal.dumps, context.journal.agents.primary()
        dump = dumps.load(event.n)
        if event.action == FILED:
            if agent:
                collection = next((ref.split(":")[1] for ref in dump.refs if ref.startswith("collection:")), "")
                context.speaking_to(agent).agent.say("filed", n=dump.n, outcome=dump.outcome, collection=collection)
            return
        items = dump.data.get("items") or {}
        waiting = [name for name in dumps._names(dump) if not (items.get(name) or {}).get(ITEM.insight)]
        if agent and waiting and not dump.completed:
            context.speaking_to(agent).agent.say("arrived", n=dump.n, title=dump.title, count=context.feature.plural(len(waiting), "item"))
