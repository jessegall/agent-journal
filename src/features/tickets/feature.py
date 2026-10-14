from events.agents import ClockTicked
from events.asking import RowWriting
from events.questions import QuestionCompleted
from events.resources import ResourceCreated
from events.tickets import (BoardOutOfTickets, KnowledgeProposed, PlanWaitsForOrchestrator, TicketAgentToWake, TicketCalled, TicketCompleted, TicketHandedIn,
                            TicketNeedsLook, TicketRestarted, TicketsDue, TicketToRevive, TicketWaitedLong)
from expects import WHEN, Answered, Dispatches, DispatchesWith, Given, Kept, Nudged, Refused, Reported, Told, Unchanged, Updated, Waited, Wrote, nothing
from framework.base import Feature
from framework.due import DueOnClock
from resources.boards import Board
from resources.tickets import Ticket
from resources.base import AGENT, CHECKPOINT, PLAN_WAITS, USER
from resources.plans import Plan
from resources.types import Notification, AgentRow, Comment, Environment, Question, Rule, Todo
from framework.journal import Journal
from features.tickets.commands import ShowTicketTodos
from controllers.types import Tickets
from features.tickets.details import TicketsDetails
from framework.sending import Nudge
from resources.tickets import DRAFTS, WAITS
from features.tickets.handlers import (TellTheUserOfLongWait, CommentOnLongWait, FinishTheBoardWithItsLastTicket, HoldTicketKnowledge, LookAfterTickets, PassOnCall, RaiseStuckTicket,
                                       RaiseWaitingPlan, RecordHandedIn, ReviveTicket, TellTicketRestarted, WakeTheTicketAgent)
from features.tickets.listeners import (SpotAnsweredQuestionOfATicket, SpotBoardOutOfTickets, SpotKnowledgeInATicket, SpotLongWaits, SpotStuckTickets,
                                        SpotTicketCalls, SpotWaitingPlans)
from features.tickets.refusing import DraftsCarryOneLine
from features.tickets.watching import boards_to_check, decisions, handed_in, ticket_calls
from declaring.registries import CARD_STORE, PHASE_ROWS, PHASE_STARTS, PLAN_STARTS
from resources.plans import PHASE
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
def writing(action: str, type_: str = "ticket", actor: str = AGENT, **fields) -> RowWriting:
    return RowWriting(type=type_, action=action, actor=actor, fields=tuple(fields.items()))


DRAFT_CARDS = [
    Given(writing("create", title="Add a login", abstract="Let people sign in.", draft=True)) >> Kept(),
    Given(writing("create", title="Add a login", draft=True)) >> Refused(ONE_LINE),
    Given(writing("create", title="Add a login", abstract="x" * 141, draft=True)) >> Refused(ONE_LINE),
    Given(writing("create", title="t" * 61, abstract="Let people sign in.", draft=True)) >> Refused(SHORT_TITLE),
    Given(writing("create", title="Add a login")) >> Kept(),
    Given(writing("create", "todo", title="Add a login")) >> Kept(),
    Given(writing("update", n=1, title="t" * 61), rows=[card(1, draft=True)]) >> Refused(SHORT_TITLE),
    Given(writing("update", n=1, title="Sign in"), rows=[card(1, draft=True)]) >> Kept(),
    Given(writing("update", n=1, abstract=""), rows=[card(1, draft=True)]) >> Refused(ONE_LINE),
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
              guarantee="While a board has tickets running, the agent orchestrating it is told to look in on their agents.",
              expects=(Given(ClockTicked(agent=1), rows=(AgentRow(n=1, title="claude-1"), run_here(), Ticket(n=1, title="Dark mode", data={"board": 1, "stage": "Doing", "work_environment": "ticket-1", "launched": WHEN + 350})),
                             earlier=(Reported("idle", "Stop"), Waited(6))) >> Nudged("check_board", about="board 1"),
                       Given(ClockTicked(agent=1), rows=(AgentRow(n=1, title="claude-1"), run_here(), Ticket(n=1, title="Dark mode", data={"board": 1, "stage": "Doing", "work_environment": "ticket-1", "launched": WHEN + 350, "halted": True})),
                             earlier=(Reported("idle", "Stop"), Waited(6))) >> Told("check_board", times=0))),
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
        journal.events.listen(ClockTicked, DueOnClock(TicketsDue), expects=[
            Given(ClockTicked(agent=1)) >> Dispatches(TicketsDue(agent=1).due()),
        ])
        journal.events.handle(TicketsDue, LookAfterTickets(), expects=[
            Given(TicketsDue(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(TicketsDue(agent=1), rows=[Ticket(n=1, title="Dark mode", data={"work_environment": "ticket-1", "launched": WHEN - 120}), AgentRow(n=1, title="claude-1")])
                >> Updated(Ticket(n=1), launched=0.0),
        ])
        journal.events.listen(TicketsDue, SpotWaitingPlans(), expects=[
            Given(TicketsDue(agent=1), rows=[run_here(), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(TicketsDue(agent=1), rows=[run_here(orchestrator_approves_plans=True), Ticket(n=1, title="Dark mode", data={"board": 1, "stage": "Doing", "work_environment": "t", "plan": 1}),
                                             Plan(n=1, title="Ship it", data={"status": "ready"}), AgentRow(n=1, title="claude-1")])
                >> DispatchesWith(PlanWaitsForOrchestrator, ticket=1, moment=PLAN_WAITS),
        ])
        journal.events.handle(PlanWaitsForOrchestrator, RaiseWaitingPlan(), expects=[
            Given(PlanWaitsForOrchestrator(ticket=1, moment=PLAN_WAITS), rows=[run_here(), waiting_for(5)]) >> Dispatches(nothing),
            Given(PlanWaitsForOrchestrator(ticket=1, moment=PLAN_WAITS), rows=[run_here(), waiting_for(5)]) >> Updated(Ticket(n=1)),
        ])
        journal.events.listen(TicketsDue, SpotTicketCalls(), expects=[
            Given(TicketsDue(agent=1), rows=[run_here(), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(TicketsDue(agent=1), rows=[run_here(paused=WHEN), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(TicketsDue(agent=1), rows=[run_here(), Ticket(n=1, title="Dark mode", data={"board": 1, "stage": "Doing", "work_environment": "t"}),
                                             AgentRow(n=1, title="claude-1", data={"event": "Stop", "last_message": "All done.", "at": WHEN - 60})])
                >> Dispatches(TicketCalled(kind="ticket_replied", ticket=1, title="Dark mode", values={"text": "All done."}).once(f"ticket_replied|ticket:1|turn:1:{int(WHEN - 60)}")),
        ])
        journal.events.handle(TicketCalled, PassOnCall(), expects=[
            Given(TicketCalled(kind="ticket_replied", ticket=1, title="Dark mode", values={"text": "done"}), rows=[AgentRow(n=1, title="claude-1")])
                >> Nudged("ticket_replied", ticket=1, title="Dark mode", text="done"),
        ])
        journal.events.handle(TicketHandedIn, RecordHandedIn(), expects=[
            Given(TicketHandedIn(ticket=1), rows=[run_here(), waiting_for(0, handed_in_at=0.0)]) >> Updated(Ticket(n=1), handed_in_at=WHEN),
        ])
        journal.events.listen(TicketsDue, SpotStuckTickets(), expects=[
            Given(TicketsDue(agent=1), rows=[run_here(), Ticket(n=1, title="Dark mode", data={"board": 1, "stage": "Doing", "work_environment": "ticket-1", "agent_seen": WHEN - 600}), AgentRow(n=1, title="claude-1")])
                >> Dispatches(TicketToRevive(ticket=1, title="Dark mode", text="stopped in ticket-1")),
            Given(TicketsDue(agent=1), rows=[run_here(), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(TicketToRevive, ReviveTicket(), expects=[
            Given(TicketToRevive(ticket=1, title="Dark mode", text="stopped"), rows=[waiting_for(5, restarts=1)]) >> Dispatches(TicketNeedsLook(ticket=1, text="stopped")),
        ])
        journal.events.handle(TicketRestarted, TellTicketRestarted(), expects=[
            Given(TicketRestarted(ticket=1, title="Dark mode"), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("ticket_restarted", ticket=1, title="Dark mode"),
        ])
        journal.events.handle(TicketNeedsLook, RaiseStuckTicket(), expects=[
            Given(TicketNeedsLook(ticket=1, text="stopped"), rows=[waiting_for(5)]) >> Dispatches(nothing),
            Given(TicketNeedsLook(ticket=1, text="stopped"), rows=[waiting_for(5)]) >> Updated(Ticket(n=1)),
        ])
        journal.events.listen(TicketsDue, SpotLongWaits(), expects=[
            Given(TicketsDue(agent=1), rows=[run_here(), waiting_for(60), AgentRow(n=1, title="claude-1")])
                >> Dispatches(TicketWaitedLong(ticket=1, minutes=60).once(f"ticket_long_wait|ticket:1|{WHEN - 3600}|1")),
            Given(TicketsDue(agent=1), rows=[run_here(), waiting_for(150), AgentRow(n=1, title="claude-1")])
                >> Dispatches(TicketWaitedLong(ticket=1, minutes=150).once(f"ticket_long_wait|ticket:1|{WHEN - 9000}|2")),
            Given(TicketsDue(agent=1), rows=[run_here(), waiting_for(5), AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(TicketsDue(agent=1), rows=[run_here(paused=WHEN), waiting_for(60), AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(TicketsDue(agent=1), rows=[Board(n=1, title="Features", data={"orchestrator": "another-environment", "stages": ["Doing"]}), waiting_for(60), AgentRow(n=1, title="claude-1")])
                >> Dispatches(nothing),
        ])
        journal.events.handle(TicketWaitedLong, TellTheUserOfLongWait(), expects=[
            Given(TicketWaitedLong(ticket=1, minutes=60), rows=[run_here(), waiting_for(60)]) >> Wrote(Notification(title="ticket 1, Dark mode, has waited 60 minutes for its review", data={"label": "Ticket waiting"})),
        ])
        journal.events.handle(TicketWaitedLong, CommentOnLongWait(), expects=[
            Given(TicketWaitedLong(ticket=1, minutes=60), rows=[run_here(), waiting_for(60)]) >> Wrote(Comment(brief=LONG_WAIT)),
        ])
        journal.events.listen(QuestionCompleted, SpotAnsweredQuestionOfATicket(), expects=[
            Given(QuestionCompleted(n=1, type="question", action="answered", actor=USER), rows=[Question(n=1, title="Which branch?", completed=1.0)]) >> Dispatches(nothing),
            Given(QuestionCompleted(n=1, type="question", action="answered", actor=USER), rows=[made(), Question(n=1, title="Which branch?", outcome="Use main", completed=1.0)])
                >> Dispatches(TicketAgentToWake(ticket=3, note="Your question 1, Which branch?, is answered: Use main. That is the answer of the one who runs your board: "
                                                              "act on it, and never file the question again.")),
        ])
        journal.events.handle(TicketAgentToWake, WakeTheTicketAgent(), expects=[
            Given(TicketAgentToWake(ticket=1, note="Your question is answered."), rows=[waiting_for(5)]) >> Unchanged(),
        ])
        journal.events.listen(TicketCompleted, SpotBoardOutOfTickets(), expects=[
            Given(CLOSED, rows=[Ticket(n=1, title="Card 1", completed=9.0, data={"board": 1}), Board(n=1, title="Launch", data={"started": 5.0})]) >> Dispatches(BoardOutOfTickets(board=1)),
            Given(CLOSED, rows=[card(1), Board(n=1, title="Launch")]) >> Dispatches(nothing),
            Given(CLOSED, rows=[card(1), card(2), Board(n=1, title="Launch", data={"started": 5.0})]) >> Dispatches(nothing),
            Given(CLOSED, rows=[card(1), Board(n=1, title="Launch", data={"started": 5.0, "finished": 9.0})]) >> Dispatches(nothing),
        ])
        journal.events.handle(BoardOutOfTickets, FinishTheBoardWithItsLastTicket(), expects=[
            Given(BoardOutOfTickets(board=1), rows=[Board(n=1, title="Launch", data={"started": 5.0})]) >> Updated(Board(n=1)),
        ])
        journal.events.listen(ResourceCreated, SpotKnowledgeInATicket(), expects=[
            Given(created("rule"), rows=[made(), Rule(n=1, title="Never skip the gate")]) >> Dispatches(KnowledgeProposed(type="rule", n=1, owner="ticket:3")),
            Given(created("rule"), rows=[made(owner=""), Rule(n=1, title="Never skip the gate")]) >> Dispatches(nothing),
            Given(created("todo"), rows=[made(), Todo(n=1, title="Fix the crash")]) >> Dispatches(nothing),
        ])
        journal.events.handle(KnowledgeProposed, HoldTicketKnowledge(), expects=[
            Given(KnowledgeProposed(type="rule", n=1, owner="ticket:3"), rows=[made(), Rule(n=1, title="Never skip the gate")]) >> Updated(Rule(n=1), proposed_for="ticket:3"),
        ])
        journal.commands.refuse(RowWriting, DraftsCarryOneLine(), expects=DRAFT_CARDS)
