import time
from dataclasses import dataclass, field
from typing import ClassVar

from engine.events import ClockTicked, ResourceEvent
from features.boards.controller import DRAFTING_PHASE, Boards
from features.parts import AgentContext, Context, Handler
from resources.base import SYSTEM

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
                               tickets=", ".join(f"ticket {t}" for t in added["tickets"]), uncovered=uncovered(context, board))


def uncovered(context: Context, board) -> str:
    if not board.done_when:
        return ""
    tickets = context.journal.of("ticket")
    present = {row["n"] for row in tickets.summaries() if not row["deleted"]}
    kept = {int(number) for t in board.added.get("tickets") or [] if int(t) in present for number in tickets.load(int(t)).covers
            if str(number).isdigit()}
    missing = [clause for number, clause in enumerate(board.done_when, 1) if number not in kept]
    return (" Name in the same line what the goal will miss without a card for it: " + "; ".join(missing) + ".") if missing else ""


QUIET_FILL = 90


class MarkQuietFillingStalled(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        boards = Boards(context.record, actor=SYSTEM)
        for board in boards._standing():
            if board.drafting.get("phase") != DRAFTING_PHASE:
                continue
            quiet = time.time() - max([float(board.updated)] + [float(t.updated) for t in boards._drafts(board)])
            if quiet > QUIET_FILL:
                boards.stall(board.n, f"nothing was written to the board for {int(quiet)} seconds")
