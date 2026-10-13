from declaring.trigger import MINUTE
from events import Fact
from events.questions import QuestionCompleted
from events.resources import ResourceCreated
from events.tickets import (BoardOutOfTickets, KnowledgeProposed, PlanWaitsForOrchestrator, TicketAgentToWake, TicketCalled, TicketCompleted,
                            TicketHandedIn, TicketNeedsLook, TicketsDue, TicketToRevive, TicketWaitedLong)
from features.tickets.calls import PLAN_DONE_CALL, calls
from features.tickets.watching import NUDGED, waited, watched
from receiving import Listener
from resources.base import CHECKPOINT, PLAN_WAITS
from resources.plans import WAITING
from resources.types import Board, Question, Ticket
from serving import Clock, ReadRows, Settings

HELD = ("rule", "doc", "tool")
LOOK_AGAIN = 15


class SpotKnowledgeInATicket(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, tickets: ReadRows[Ticket]) -> list[Fact]:
        owner = tickets.proposing_owner() if event.type in HELD else ""
        return [KnowledgeProposed(type=event.type, n=event.n, owner=owner)] if owner else []


class SpotAnsweredQuestionOfATicket(Listener[QuestionCompleted]):
    def listen(self, event: QuestionCompleted, tickets: ReadRows[Ticket], questions: ReadRows[Question]) -> list[Fact]:
        if not (ticket := tickets.here()):
            return []
        question = questions.peek(event.n)
        note = (f"Your question {question.n}, {question.title}, is answered: {question.outcome}. That is the answer of the one who runs your board: "
                f"act on it, and never file the question again.")
        return [TicketAgentToWake(ticket=ticket, note=note)]


class SpotBoardOutOfTickets(Listener[TicketCompleted]):
    def listen(self, event: TicketCompleted, tickets: ReadRows[Ticket]) -> list[Fact]:
        board = tickets.board_of(tickets.peek(event.n))
        if not board or not board.started or board.finished or any(int(other.board) == board.n for other in tickets.rows.standing()):
            return []
        return [BoardOutOfTickets(board=board.n)]


class SpotWaitingPlans(Listener[TicketsDue]):
    def listen(self, event: TicketsDue, tickets: ReadRows[Ticket], boards: ReadRows[Board]) -> list[Fact]:
        paused = boards.paused()
        waiting = [t for t in tickets.awaiting_orchestrator() if not (t.board and int(t.board) in paused) and not tickets.reviewing(t)]
        found = []
        for ticket in waiting:
            plan = tickets.plans_of(ticket).peek(ticket.plan)
            found.append(PlanWaitsForOrchestrator(ticket=ticket.n, moment=CHECKPOINT if plan.status == WAITING else PLAN_WAITS)
                         .once(f"plan_waits|{ticket.ref}|{ticket.plan}|{plan.updated}"))
        return found


class SpotTicketCalls(Listener[TicketsDue]):
    def listen(self, event: TicketsDue, tickets: ReadRows[Ticket]) -> list[Fact]:
        found = []
        for ticket in watched(tickets):
            for kind, key, values, every in calls(tickets, ticket):
                if kind in NUDGED or (kind == PLAN_DONE_CALL and ticket.handed_in_at):
                    continue
                fact = TicketHandedIn(ticket=ticket.n) if kind == PLAN_DONE_CALL else TicketCalled(kind=kind, ticket=ticket.n, title=ticket.title, values=values)
                claim = f"{kind}|{ticket.ref}|{key}"
                found.append(fact.spaced(claim, every * MINUTE) if every else fact.once(claim))
        return found


class SpotStuckTickets(Listener[TicketsDue]):
    def listen(self, event: TicketsDue, tickets: ReadRows[Ticket]) -> list[Fact]:
        found = []
        for ticket, state in tickets.needing_a_look(tickets.orchestrating()):
            if state.kind == "stopped" and tickets.revivable(ticket):
                found.append(TicketToRevive(ticket=ticket.n, title=ticket.title, text=state.text))
            else:
                found.append(TicketNeedsLook(ticket=ticket.n, text=state.text).spaced(f"ticket_attention|{ticket.ref}|{state.kind}", LOOK_AGAIN * MINUTE))
        return found


class SpotLongWaits(Listener[TicketsDue]):
    def listen(self, event: TicketsDue, tickets: ReadRows[Ticket], settings: Settings, clock: Clock) -> list[Fact]:
        now, limit = clock.now(), int(settings.tell_the_user_after)
        return [TicketWaitedLong(ticket=ticket.n, minutes=waited(ticket, now)).once(f"ticket_long_wait|{ticket.ref}|{ticket.handed_in_at}")
                for ticket in watched(tickets) if ticket.handed_in_at and waited(ticket, now) >= limit]
