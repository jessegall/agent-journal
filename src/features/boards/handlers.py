from dataclasses import dataclass, field
from typing import ClassVar

from engine.events import ResourceEvent
from features.parts import Context, Handler

ADDED = "added"


@dataclass(frozen=True)
class BoardChanged(ResourceEvent):
    on: ClassVar[str] = "board"
    fields: list = field(default_factory=list)


class OfferToPlaceAddedCards(Handler):
    def handle(self, context: Context, event: BoardChanged) -> None:
        if event.action != "updated" or ADDED not in event.fields:
            return
        board = context.journal.boards.load(event.n)
        added, agent = board.added, context.journal.agents.primary()
        if not agent or not added.get("tickets"):
            return
        speaking = context.speaking_to(agent)
        if speaking.once(ADDED, f"{board.n}:{added['at']}"):
            speaking.agent.say(ADDED, n=board.n, title=board.title, count=len(added["tickets"]),
                               tickets=", ".join(f"ticket {t}" for t in added["tickets"]))
