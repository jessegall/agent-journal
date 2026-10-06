from dataclasses import dataclass
from typing import ClassVar

from engine.events.resources import ResourceEvent
from features.parts import Context, Handler
from features.suggestions.controller import Decision
from features.suggestions.controller import Suggestions
from controllers.types import Agents, Todos
from resources.base import SYSTEM, USER

SAID = {Decision.ACCEPT: "You said yes to suggestion", Decision.ADJUST: "You changed suggestion", Decision.DECLINE: "You said no to suggestion"}


@dataclass(frozen=True)
class SuggestionDecided(ResourceEvent):
    on: ClassVar[str] = "suggestion.completed"


@dataclass(frozen=True)
class SuggestionReopened(ResourceEvent):
    on: ClassVar[str] = "suggestion.reopened"


def mark_key(n: int) -> str:
    return f"suggestion:{n}"


class FileDecidedSuggestion(Handler):
    def handle(self, context: Context, event: SuggestionDecided) -> None:
        s = context.journal.get(Suggestions).load(event.n)
        decision = Decision(s.decision)
        made = self.filed(context, s, decision) if decision.files_todo() else None
        agents = Agents(context.record, actor=SYSTEM)
        row = agents.primary()
        if event.actor != USER or decision not in SAID or not row:
            return
        agents.card(row.n, key=mark_key(s.n), label=SAID[decision], name=str(s.n), detail=f"Added to-do {made.n}" if made else "",
                    icon="bulb", color="var(--blocking)", side=USER, row=s.ref)

    def filed(self, context: Context, s, decision: Decision):
        accepted = decision == Decision.ACCEPT
        title = s.title if accepted else s.outcome.split("\n")[0][:80]
        brief = s.brief if accepted else f"{s.outcome}\n\nProposed as: {s.title}\n{s.brief}".strip()
        made = context.journal.get(Todos).create(title, brief=brief, about=s.ref)
        Suggestions(context.record, actor=SYSTEM).update(s.n, todo=made.n)
        return made


class DropTakenBackMark(Handler):
    def handle(self, context: Context, event: SuggestionReopened) -> None:
        agents = Agents(context.record, actor=SYSTEM)
        row = agents.primary()
        if row:
            agents.drop_card(row.n, mark_key(event.n))
