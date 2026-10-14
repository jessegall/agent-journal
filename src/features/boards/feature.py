from events.agents import ClockTicked
from expects import WHEN, Dispatches, Given, Kept, Nudged, Refused, Reported, Told, Updated, nothing
from framework.base import Feature
from events.boards import BoardChanged
from resources.boards import PANEL_REPLY, Board
from features.boards.exploration import FILLER
from resources.base import AGENT, USER
from resources.types import AgentRow, Message
from resources.base import SYSTEM
from declaring.registries import SHIPPED
from controllers.types import Boards
from framework.agent_types import written
from features.boards.agent_types import AGENT_TYPES
from features.boards.details import BoardsDetails
from features.boards.handlers import MarkQuietFillingStalled, OfferToPlaceAddedCards
from features.boards.listeners import SpotCardsAdded, SpotQuietFilling
from features.boards.refusing import BoardWorkStaysOnTheBoard, FillerKeepsToTheBoard, PanelRepliesStayShort
from features.boards.watching import boards_wanting_ideas
from events.asking import RowWriting
from events.boards import BoardFillingQuiet, CardsAddedToBoard
from features.boards.shipped import JOBS, SEQUENCES
from framework.journal import Journal
from framework.sending import Nudge
from declaring.registries import BOARD_OF_MESSAGE, DISPATCH_MODELS
from features.boards.orchestration import filler_model, orchestration
from declaring.registries import ORCHESTRATION, START_PARTS

__all__ = ["Boards"]


AGENT_ROW = AgentRow(n=1, title="claude-1")


class StalledWhileDrafting:
    def __eq__(self, drafting: dict) -> bool:
        return {"phase": "stalled", "stalled_from": "drafting"}.items() <= drafting.items()

def writing(type_: str, action: str = "create", actor: str = AGENT, agent: str = "", **fields) -> RowWriting:
    return RowWriting(type=type_, action=action, actor=actor, agent=agent, fields=tuple(fields.items()))


KEPT_ON_THE_BOARD = (f"the {FILLER} is filling the board: the work goes on its board, so ask with journal board ask "
                     "and draft tickets with journal ticket create; no {} of its own")
TOO_LONG = ("your reply to the board is {} characters, and the New work panel shows one short line of at most " + str(PANEL_REPLY) +
            ": say it again, shorter, about the tickets only")
WRITES_CARDS = ("the board's agent writes cards, never a {}: draft the request as a card with journal ticket create "
                '"<title>" --abstract "<one line>" --set board=<n> --set draft=true, or revise one with journal ticket update <n>')
FILLER_KEEPS = [
    Given(writing("todo", agent=FILLER)) >> Refused(WRITES_CARDS.format("todo")),
    Given(writing("plan", agent=FILLER)) >> Refused(WRITES_CARDS.format("plan")),
    Given(writing("todo", "update", agent=FILLER)) >> Refused(WRITES_CARDS.format("todo")),
    Given(writing("todo", "complete", agent=FILLER)) >> Refused(WRITES_CARDS.format("todo")),
    Given(writing("ticket", agent=FILLER)) >> Kept(),
    Given(writing("comment", agent=FILLER)) >> Kept(),
    Given(writing("todo")) >> Kept(),
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
                    guarantee="When a board asks for ideas, the agent is told to think up what might be wanted on it.",
                    expects=(Given(ClockTicked(agent=1), rows=(Board(n=1, title="Launch", data={"environment": "t"}), AGENT_ROW), earlier=(Reported("idle", "Stop"),)) >> Told("ideas"),
                             Given(ClockTicked(agent=1), rows=(Board(n=1, title="Launch", data={"environment": "t", "ideas_at": WHEN}), AGENT_ROW), earlier=(Reported("idle", "Stop"),)) >> Told("ideas", times=0),
                             Given(ClockTicked(agent=1), rows=(Board(n=1, title="Launch", data={"environment": "elsewhere"}), AGENT_ROW), earlier=(Reported("idle", "Stop"),)) >> Told("ideas", times=0),
                             Given(ClockTicked(agent=1), rows=(Board(n=1, title="Launch", data={"environment": "t", "finished": WHEN}), AGENT_ROW), earlier=(Reported("idle", "Stop"),)) >> Told("ideas", times=0))),)
    sequences = SEQUENCES
    agent_types = AGENT_TYPES

    def settings_changed(self, record, actor: str) -> None:
        written(record.root.parent, record)

    def register(self, journal: Journal) -> None:
        START_PARTS.add(self, orchestration, key=ORCHESTRATION)
        for job, shipped in JOBS.items():
            for sequence in shipped:
                SHIPPED.add(self, sequence.title, key=job)
        DISPATCH_MODELS.add(self, filler_model, key=FILLER)
        BOARD_OF_MESSAGE.add(self, board_of_message)
        journal.commands.refuse(RowWriting, BoardWorkStaysOnTheBoard(), expects=[
            Given(writing("plan", agent=FILLER)) >> Refused(KEPT_ON_THE_BOARD.format("plan")),
            Given(writing("question", agent=FILLER)) >> Refused(KEPT_ON_THE_BOARD.format("question")),
            Given(writing("plan", actor=USER, agent=FILLER)) >> Kept(),
            Given(writing("plan", agent=FILLER, hidden=True)) >> Kept(),
            Given(writing("todo", agent=FILLER)) >> Kept(),
            Given(writing("plan")) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, PanelRepliesStayShort(), expects=[
            Given(writing("comment", about="message:1", brief="x" * (PANEL_REPLY + 1)), rows=[on_the_board()]) >> Refused(TOO_LONG.format(PANEL_REPLY + 1)),
            Given(writing("comment", about="message:1", brief="x" * PANEL_REPLY), rows=[on_the_board()]) >> Kept(),
            Given(writing("comment", about="message:1", brief="> quoted\n" + "x" * (PANEL_REPLY + 50)), rows=[on_the_board()]) >> Refused(TOO_LONG.format(PANEL_REPLY + 50)),
            Given(writing("comment", about="message:1", brief="x" * (PANEL_REPLY + 1)), rows=[Message(n=1, title="Add a login")]) >> Kept(),
            Given(writing("comment", about="todo:1", brief="x" * (PANEL_REPLY + 1)), rows=[on_the_board()]) >> Kept(),
            Given(writing("comment", actor=USER, about="message:1", brief="x" * (PANEL_REPLY + 1)), rows=[on_the_board()]) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, FillerKeepsToTheBoard(), expects=FILLER_KEEPS)
        journal.events.listen(BoardChanged, SpotCardsAdded(), expects=[
            Given(added(), rows=[board(4, 5), AGENT_ROW])
                >> Dispatches(CardsAddedToBoard(board=1, title="Launch", count=2, tickets="ticket 4, ticket 5", missing=()).once("added|1:10.0")),
            Given(added(), rows=[board(), AGENT_ROW]) >> Dispatches(nothing),
            Given(added(), rows=[board(4, 5)]) >> Dispatches(nothing),
            Given(added(fields=("title",)), rows=[board(4, 5), AGENT_ROW]) >> Dispatches(nothing),
            Given(added(action="created"), rows=[board(4, 5), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(CardsAddedToBoard, OfferToPlaceAddedCards(), expects=[
            Given(CardsAddedToBoard(board=1, title="Launch", count=2, tickets="ticket 4, ticket 5", missing=()), rows=[board(4, 5), AGENT_ROW]) >> Nudged("added", n=1, count=2),
        ])
        journal.events.listen(ClockTicked, SpotQuietFilling(), expects=[
            Given(ClockTicked(agent=1), rows=[Board(n=1, title="Launch", data={"drafting": {"phase": "drafting", "since": 1.0}}), AGENT_ROW])
                >> Dispatches(BoardFillingQuiet(board=1, seconds=int(WHEN))),
            Given(ClockTicked(agent=1), rows=[Board(n=1, title="Launch", data={"drafting": {"phase": "waiting"}}), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(BoardFillingQuiet, MarkQuietFillingStalled(), expects=[
            Given(BoardFillingQuiet(board=1, seconds=100), rows=[Board(n=1, title="Launch", data={"drafting": {"phase": "drafting", "since": 1.0}}), AGENT_ROW])
                >> Updated(Board(n=1), drafting=StalledWhileDrafting()),
        ])
