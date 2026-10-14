from events import Fact
from events.agents import ClockTicked
from events.boards import BoardChanged, BoardFillingQuiet, CardsAddedToBoard
from receiving import Listener
from resources.boards import DRAFTING_PHASE
from resources.types import AgentRow, Board
from serving import Clock, ReadRows

ADDED = "added"
QUIET_FILL = 90


def missing(boards: ReadRows[Board], board) -> tuple[str, ...]:
    return tuple(boards.uncovered(board)) if board.done_when else ()


class SpotCardsAdded(Listener[BoardChanged]):
    def listen(self, event: BoardChanged, boards: ReadRows[Board], agents: ReadRows[AgentRow]) -> list[Fact]:
        if event.action != "updated" or ADDED not in event.fields or not agents.has_primary():
            return []
        board = boards.peek(event.n)
        added = board.added
        if not added.get("tickets"):
            return []
        return [CardsAddedToBoard(board=board.n, title=board.title, count=len(added["tickets"]), tickets=", ".join(f"ticket {t}" for t in added["tickets"]),
                                  missing=missing(boards, board)).once(f"{ADDED}|{board.n}:{added['at']}")]


class SpotQuietFilling(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, boards: ReadRows[Board], clock: Clock) -> list[Fact]:
        found = []
        for board in boards.rows.standing():
            if board.phase != DRAFTING_PHASE:
                continue
            quiet = clock.now() - max([float(board.updated)] + [float(t.updated) for t in boards.drafts(board)])
            if quiet > QUIET_FILL:
                found.append(BoardFillingQuiet(board=board.n, seconds=int(quiet)))
        return found
