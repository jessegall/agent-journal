import time
from dataclasses import dataclass, field
from typing import ClassVar

from engine.events.engine import ClockTicked
from engine.events.resources import ResourceEvent
from features.boards.controller import Boards
from features.boards.resource import DRAFTING_PHASE
from features.sending import Sent
from features.parts import AgentContext, Context, Handler
from resources.base import SYSTEM
from features.boards.controller import Boards

ADDED = "added"


@dataclass(frozen=True)
class BoardChanged(ResourceEvent):
    on: ClassVar[str] = "board"
    fields: list = field(default_factory=list)


class OfferToPlaceAddedCards(Handler):
    def handle(self, context: Context, event: BoardChanged) -> None:
        if event.action != "updated" or ADDED not in event.fields:
            return
        boards = Boards(context.record, actor=SYSTEM)
        board = boards.load(event.n)
        added, speaking = board.added, context.to_primary()
        if not speaking or not added.get("tickets"):
            return
        if speaking.once(ADDED, f"{board.n}:{added['at']}"):
            speaking.agent.say(ADDED, n=board.n, title=board.title, count=len(added["tickets"]),
                               tickets=", ".join(f"ticket {t}" for t in added["tickets"]), uncovered=uncovered(boards, board))


def uncovered(boards: Boards, board) -> str:
    missing = boards._uncovered(board) if board.done_when else []
    return (" Name in the same line what the goal will miss without a card for it: " + "; ".join(missing) + ".") if missing else ""


QUIET_FILL = 90


class MarkQuietFillingStalled(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        boards = Boards(context.record, actor=SYSTEM)
        for board in boards.rows.standing():
            if board.phase != DRAFTING_PHASE:
                continue
            quiet = time.time() - max([float(board.updated)] + [float(t.updated) for t in boards._drafts(board)])
            if quiet > QUIET_FILL:
                boards.stall(board.n, f"nothing was written to the board for {int(quiet)} seconds")


def boards_wanting_ideas(context, agent) -> list[Sent]:
    every = context.feature.interval(context.record, "ideas")
    return [Sent(str(board.n), {"n": board.n, "title": board.title}) for board in context.journal.get(Boards).rows.standing()
            if board.environment == context.record.env and not board.finished and time.time() - float(board.ideas_at) >= every]