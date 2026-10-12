from events.agents import ClockTicked
from controllers.types import Comments, Questions, Todos
from controllers.types import Plans
from expects import Given, Kept, Nudged, Refused, Unchanged, Updated
from framework.base import Feature
from events.boards import BoardChanged
from resources.boards import PANEL_REPLY, Board
from controllers.types import Tickets
from features.boards.exploration import FILLER
from resources.base import AGENT, USER
from resources.types import AgentRow, Message
from resources.base import SYSTEM
from declaring.registries import SHIPPED
from controllers.types import Boards
from features.boards.details import BoardsDetails
from features.boards.handlers import MarkQuietFillingStalled, OfferToPlaceAddedCards, boards_wanting_ideas
from features.boards.shipped import JOBS, SEQUENCES
from features.boards.limits import BoardWorkStaysOnTheBoard, FillerKeepsToTheBoard, PanelRepliesStayShort
from framework.journal import Journal
from framework.sending import Nudge
from features.sequences.dispatch import BOARD_OF_MESSAGE, DISPATCH_MODELS
from features.boards.orchestration import filler_model, orchestration
from features.session_briefing.start import ORCHESTRATION, START_PARTS

__all__ = ["Boards"]


AGENT_ROW = AgentRow(n=1, title="claude-1")


class StalledWhileDrafting:
    def __eq__(self, drafting: dict) -> bool:
        return {"phase": "stalled", "stalled_from": "drafting"}.items() <= drafting.items()

FILLING = {"actor": AGENT, "agent": FILLER}
ASKING = {"actor": AGENT}
KEPT_ON_THE_BOARD = (f"the {FILLER} is filling the board: the work goes on its board, so ask with journal board ask "
                     "and draft tickets with journal ticket create; no {} of its own")

FILLING = {"actor": AGENT, "agent": FILLER}
ASKING = {"actor": AGENT}
KEPT_ON_THE_BOARD = (f"the {FILLER} is filling the board: the work goes on its board, so ask with journal board ask "
                     "and draft tickets with journal ticket create; no {} of its own")
TOO_LONG = ("your reply to the board is {} characters, and the New work panel shows one short line of at most " + str(PANEL_REPLY) +
            ": say it again, shorter, about the tickets only")
WRITES_CARDS = ("the board's agent writes cards, never a {}: draft the request as a card with journal ticket create "
                '"<title>" --abstract "<one line>" --set board=<n> --set draft=true, or revise one with journal ticket update <n>')
FILLER_KEEPS = [
    Given((Todos, FILLING, {})) >> Refused(WRITES_CARDS.format("todo")),
    Given((Plans, FILLING, {})) >> Refused(WRITES_CARDS.format("plan")),
    Given((Tickets, FILLING, {})) >> Kept(),
    Given((Comments, FILLING, {})) >> Kept(),
    Given((Todos, ASKING, {})) >> Kept(),
]


def on_the_board(**data) -> Message:
    return Message(n=1, title="Add a login", refs=["board:1"], data=data)


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
        for job, shipped in JOBS.items():
            for sequence in shipped:
                SHIPPED.add(self, sequence.title, key=job)
        DISPATCH_MODELS.add(self, filler_model, key=FILLER)
        BOARD_OF_MESSAGE.add(self, board_of_message)
        journal.commands.intercept("create", BoardWorkStaysOnTheBoard(), expects=[
            Given((Plans, FILLING, {})) >> Refused(KEPT_ON_THE_BOARD.format("plan")),
            Given((Questions, FILLING, {})) >> Refused(KEPT_ON_THE_BOARD.format("question")),
            Given((Plans, {"actor": USER, "agent": FILLER}, {})) >> Kept(),
            Given((Plans, FILLING, {"hidden": True})) >> Kept(),
            Given((Todos, FILLING, {})) >> Kept(),
            Given((Plans, ASKING, {})) >> Kept(),
        ])
        journal.commands.intercept("create", PanelRepliesStayShort(), expects=[
            Given((Comments, ASKING, {"about": "message:1", "brief": "x" * (PANEL_REPLY + 1)}), rows=[on_the_board()]) >> Refused(TOO_LONG.format(PANEL_REPLY + 1)),
            Given((Comments, ASKING, {"about": "message:1", "brief": "x" * PANEL_REPLY}), rows=[on_the_board()]) >> Kept(),
            Given((Comments, ASKING, {"about": "message:1", "brief": "> quoted\n" + "x" * (PANEL_REPLY + 50)}), rows=[on_the_board()]) >> Refused(TOO_LONG.format(PANEL_REPLY + 50)),
            Given((Comments, ASKING, {"about": "message:1", "brief": "x" * (PANEL_REPLY + 1)}), rows=[Message(n=1, title="Add a login")]) >> Kept(),
            Given((Comments, ASKING, {"about": "todo:1", "brief": "x" * (PANEL_REPLY + 1)}), rows=[on_the_board()]) >> Kept(),
            Given((Comments, {"actor": USER}, {"about": "message:1", "brief": "x" * (PANEL_REPLY + 1)}), rows=[on_the_board()]) >> Kept(),
        ])
        journal.commands.intercept("create", FillerKeepsToTheBoard(), expects=FILLER_KEEPS)
        journal.commands.intercept("update", FillerKeepsToTheBoard(), expects=FILLER_KEEPS)
        journal.commands.intercept("complete", FillerKeepsToTheBoard(), expects=FILLER_KEEPS)
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
