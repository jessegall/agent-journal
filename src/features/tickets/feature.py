from events.agents import ClockTicked
from events.resources import ResourceCreated
from events.questions import QuestionCompleted
from controllers.types import Todos
from expects import WHEN, Answered, Given, Kept, Refused, Unchanged, Updated, Wrote
from framework.base import Feature
from features.boards.resource import Board
from events.tickets import TicketCompleted
from features.tickets.resource import Ticket
from resources.base import AGENT, USER
from resources.types import AgentRow, Comment, Environment, Question, Rule, Todo
from framework.journal import Journal
from features.tickets.commands import ShowTicketTodos
from features.tickets.controller import Tickets
from features.tickets.details import TicketsDetails
from framework.sending import Nudge
from features.tickets.orchestration import DRAFTS, WAITS
from features.tickets.handlers import (
    FinishTheBoardWithItsLastTicket,
    HoldTicketKnowledge,
    LookAfterTickets,
    WakeTheTicketAgent,
    boards_to_check,
    decisions,
    handed_in,
    ticket_calls,
)
from features.tickets.limits import DraftsCarryOneLine
from features.boards.controller import CARD_STORE
from features.plans.controller import PHASE_ROWS, PHASE_STARTS, PLAN_STARTS
from features.plans.resource import PHASE
from features.tickets.phases import start_tickets_of_phase
from features.tickets.worker import start_worker

__all__ = ["Tickets"]


CLOSED = TicketCompleted(n=1, type="ticket", action="completed", actor=USER)


def made(owner: str = "ticket:3") -> Environment:
    return Environment(n=1, title="t", data={"owner": owner})


def created(type_: str) -> ResourceCreated:
    return ResourceCreated(n=1, type=type_, action="created", actor=USER)

def card(n: int, **data) -> Ticket:
    return Ticket(n=n, title=f"Card {n}", data={"board": 1, **data})

ONE_LINE = ('a draft ticket carries --abstract "<one line>" of at most 140 characters, shown whole on its card; '
            "the deeper explanation goes in --brief and shows under More info")
SHORT_TITLE = "a draft ticket's title names it in at most 60 characters, so its card shows it whole"
DRAFTING = {"actor": AGENT}
DRAFT_CARDS = [
    Given((Tickets, DRAFTING, {"title": "Add a login", "abstract": "Let people sign in.", "draft": True})) >> Kept(),
    Given((Tickets, DRAFTING, {"title": "Add a login", "draft": True})) >> Refused(ONE_LINE),
    Given((Tickets, DRAFTING, {"title": "Add a login", "abstract": "x" * 141, "draft": True})) >> Refused(ONE_LINE),
    Given((Tickets, DRAFTING, {"title": "t" * 61, "abstract": "Let people sign in.", "draft": True})) >> Refused(SHORT_TITLE),
    Given((Tickets, DRAFTING, {"title": "Add a login"})) >> Kept(),
    Given((Todos, DRAFTING, {"title": "Add a login"})) >> Kept(),
    Given((Tickets, DRAFTING, {"n": 1, "title": "t" * 61}), rows=[card(1, draft=True)]) >> Refused(SHORT_TITLE),
    Given((Tickets, DRAFTING, {"n": 1, "title": "Sign in"}), rows=[card(1, draft=True)]) >> Kept(),
    Given((Tickets, DRAFTING, {"n": 1, "abstract": ""}), rows=[card(1, draft=True)]) >> Refused(ONE_LINE),
]


LONG_WAIT = "Its work has waited 60 minutes for the orchestrator to review, test and merge it."


def run_here(**data) -> Board:
    return Board(n=1, title="Features", data={"orchestrator": "t", "stages": ["Doing"], **data})


def waiting_for(minutes: int, **data) -> Ticket:
    """A ticket whose finished work has waited that long for the agent orchestrating its board: what an expectation states its Given with."""
    return Ticket(n=1, title="Dark mode", data={"board": 1, "stage": "Doing", "work_environment": "ticket-1", "handed_in_at": WHEN - minutes * 60, **data})


class TicketsFeature(Feature):
    details = TicketsDetails
    nudges = (
        Nudge("ticket_asks", behaviour="asks", about=ticket_calls("ticket_asks"),
              guarantee="When a ticket's own agent asks a question, the agent orchestrating its board is told, and told again until it is answered."),
        Nudge("ticket_awaits", behaviour="awaits", about=ticket_calls("ticket_awaits"),
              guarantee="When a ticket's own agent is waiting on something, the agent orchestrating its board is told what it waits for."),
        Nudge(WAITS, behaviour="waits", about=decisions(WAITS),
              guarantee="When a ticket proposes that it should wait on another, the orchestrating agent is asked to accept or decline it."),
        Nudge(DRAFTS, behaviour="drafts", about=decisions(DRAFTS),
              guarantee="While a drafted ticket waits to be confirmed, the orchestrating agent is told it is waiting."),
        Nudge("ticket_handed_in", behaviour="handed in", about=handed_in,
              guarantee="While a ticket's finished work waits for the agent orchestrating its board, that agent is told how long it has waited and what to do: review, test and merge it."),
        Nudge("check_board", behaviour="board check", about=boards_to_check,
              guarantee="While a board has tickets running, the agent orchestrating it is told to look in on their agents."),
    )

    def register(self, journal: Journal) -> None:
        PHASE_ROWS.add(None, Tickets, key=PHASE.tickets)
        CARD_STORE.add(None, Tickets)
        PHASE_STARTS.add(self, start_tickets_of_phase)
        PLAN_STARTS.add(self, start_worker)
        journal.commands.add("ticket", ShowTicketTodos(), expects=[
            Given((Tickets,)) >> Answered([]),
            Given((Tickets,), rows=[card(1)]) >> Answered([]),
            Given((Tickets,), rows=[card(1, work_environment="ticket-1")]) >> Answered([]),
        ])
        # One side of the sweep only: it also closes merged tickets, starts queued ones, stops orphaned agents and raises waiting plans, none of which is staged here; what is stated is the long wait of a handed-in ticket and the boards it leaves alone.
        journal.events.handler(LookAfterTickets(), expects=[
            Given(ClockTicked(agent=1), rows=[run_here(), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Wrote(Comment(brief=LONG_WAIT)),
            Given(ClockTicked(agent=1), rows=[run_here(), waiting_for(5), AgentRow(n=1, title="claude-1")]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[run_here(paused=WHEN), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[Board(n=1, title="Features", data={"orchestrator": "another-environment", "stages": ["Doing"]}), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(WakeTheTicketAgent(), expects=[
            Given(QuestionCompleted(n=1, type="question", action="answered", actor=USER), rows=[Question(n=1, title="Which branch?", completed=1.0)]) >> Unchanged(),
        ])
        journal.events.handler(FinishTheBoardWithItsLastTicket(), expects=[
            Given(CLOSED, rows=[card(1), Board(n=1, title="Launch")]) >> Unchanged(),
            Given(CLOSED, rows=[card(1), card(2), Board(n=1, title="Launch", data={"started": 5.0})]) >> Unchanged(),
            Given(CLOSED, rows=[card(1), Board(n=1, title="Launch", data={"started": 5.0, "finished": 9.0})]) >> Unchanged(),
        ])
        journal.events.handler(HoldTicketKnowledge(), expects=[
            Given(created("rule"), rows=[made(), Rule(n=1, title="Never skip the gate")]) >> Updated(Rule(n=1), proposed_for="ticket:3"),
            Given(created("rule"), rows=[made(owner=""), Rule(n=1, title="Never skip the gate")]) >> Unchanged(),
            Given(created("todo"), rows=[made(), Todo(n=1, title="Fix the crash")]) >> Unchanged(),
        ])
        journal.commands.intercept("create", DraftsCarryOneLine(), expects=DRAFT_CARDS)
        journal.commands.intercept("update", DraftsCarryOneLine(), expects=DRAFT_CARDS)
