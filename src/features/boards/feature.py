from engine.events.engine import ClockTicked
from expects import Given, Nudged, Unchanged, Updated
from features.base import Feature
from features.boards.handlers import BoardChanged
from features.boards.resource import Board
from resources.base import USER
from resources.types import AgentRow
from resources.base import SYSTEM
from features.boards.controller import Boards
from features.boards.details import BoardsDetails
from features.boards.handlers import MarkQuietFillingStalled, OfferToPlaceAddedCards, boards_wanting_ideas
from features.boards.shipped import SEQUENCES
from features.boards.limits import BoardWorkStaysOnTheBoard, FillerKeepsToTheBoard, PanelRepliesStayShort
from features.journal import Journal
from features.sending import Nudge
from features.boards.exploration import FILLER
from features.sequences.dispatch import BOARD_OF_MESSAGE, DISPATCH_MODELS
from features.boards.orchestration import filler_model, orchestration
from features.session_briefing.start import ORCHESTRATION, START_PARTS

__all__ = ["Boards"]


AGENT_ROW = AgentRow(n=1, title="claude-1")


class StalledWhileDrafting:
    def __eq__(self, drafting: dict) -> bool:
        return {"phase": "stalled", "stalled_from": "drafting"}.items() <= drafting.items()


def added(fields=("added",), action="updated") -> BoardChanged:
    return BoardChanged(n=1, type="board", action=action, actor=USER, fields=list(fields))


def board(*tickets: int, **data) -> Board:
    return Board(n=1, title="Launch", data={"added": {"tickets": list(tickets), "at": 10.0}, **data})


def board_of_message(record, message) -> int:
    return Boards(record, actor=SYSTEM).of_message(message)


class BoardsFeature(Feature):
    details = BoardsDetails
    nudges = (Nudge("ideas", behaviour="ideas", about=boards_wanting_ideas,
                    guarantee="When a board asks for ideas, the agent is told to think up what might be wanted on it."),)
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, orchestration, key=ORCHESTRATION)
        DISPATCH_MODELS.add(self, filler_model, key=FILLER)
        BOARD_OF_MESSAGE.add(self, board_of_message)
        journal.commands.intercept("create", BoardWorkStaysOnTheBoard())
        journal.commands.intercept("create", PanelRepliesStayShort())
        journal.commands.intercept("create", FillerKeepsToTheBoard())
        journal.commands.intercept("update", FillerKeepsToTheBoard())
        journal.commands.intercept("complete", FillerKeepsToTheBoard())
        journal.events.handler(OfferToPlaceAddedCards(), expects=[
            Given(added(), rows=[board(4, 5), AGENT_ROW]) >> Nudged("added"),
            Given(added(), rows=[board(), AGENT_ROW]) >> Unchanged(),
            Given(added(), rows=[board(4, 5)]) >> Unchanged(),
            Given(added(fields=("title",)), rows=[board(4, 5), AGENT_ROW]) >> Unchanged(),
            Given(added(action="created"), rows=[board(4, 5), AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(MarkQuietFillingStalled(), expects=[
            Given(ClockTicked(agent=1), rows=[Board(n=1, title="Launch", data={"drafting": {"phase": "drafting", "since": 1.0}}), AGENT_ROW]) >> Updated(Board(n=1), drafting=StalledWhileDrafting()),
            Given(ClockTicked(agent=1), rows=[Board(n=1, title="Launch", data={"drafting": {"phase": "waiting"}}), AGENT_ROW]) >> Unchanged(),
        ])
