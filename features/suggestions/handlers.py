from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.parts import Context, Handler
from features.suggestions.controller import ACCEPT, ADJUST


@dataclass(frozen=True)
class SuggestionDecided(ResourceEvent):
    on: ClassVar[str] = "suggestion.completed"


class FileDecidedSuggestion(Handler):
    def handle(self, context: Context, event: SuggestionDecided) -> None:
        s = context.journal.suggestions.load(event.n)
        accepted = s.decision == ACCEPT.lower()
        if not accepted and s.decision != ADJUST.lower():
            return
        title = s.title if accepted else s.outcome.split("\n")[0][:80]
        brief = s.brief if accepted else f"{s.outcome}\n\nProposed as: {s.title}\n{s.brief}".strip()
        context.journal.todos.create(title, brief=brief, about=s.ref)
