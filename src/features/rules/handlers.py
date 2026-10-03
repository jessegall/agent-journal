from dataclasses import dataclass
from typing import ClassVar

from engine.events.resources import ResourceCreated, ResourceEvent
from features.journal_laws.policy import brief
from features.parts import Context, Handler
from resources.base import AGENT



@dataclass(frozen=True)
class RuleChanged(ResourceEvent):
    on: ClassVar[str] = "rule"


class InjectRules(Handler):
    def handle(self, context: Context, event: RuleChanged) -> None:
        brief(context.record.root.parent, context.record)


class ReviewNewRule(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.actor != AGENT or event.type != "rule":
            return
        agent = context.journal.agents.primary()
        if agent:
            context.speaking_to(agent).agent.whisper("review", n=event.n, title=context.journal.rules.load(event.n).title)
