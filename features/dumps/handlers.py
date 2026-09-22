from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.dumps.resource import ITEM
from features.parts import Context, Handler
from resources.base import USER

WRITTEN = ("created", "updated")


@dataclass(frozen=True)
class DumpWritten(ResourceEvent):
    on: ClassVar[str] = "dump"

    def wanted(self) -> bool:
        return self.action in WRITTEN and self.actor == USER


class PromptFiling(Handler):
    def handle(self, context: Context, event: DumpWritten) -> None:
        dumps, agent = context.journal.dumps, context.journal.agents.primary()
        dump = dumps.load(event.n)
        items = dump.data.get("items") or {}
        waiting = [name for name in dumps._names(dump) if not (items.get(name) or {}).get(ITEM.insight)]
        if agent and waiting and not dump.completed:
            context.speaking_to(agent).agent.say("arrived", n=dump.n, title=dump.title, count=context.feature.plural(len(waiting), "item"))
