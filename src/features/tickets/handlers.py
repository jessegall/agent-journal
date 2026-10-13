from contextlib import suppress

from events import Fact
from events.tickets import (BoardOutOfTickets, KnowledgeProposed, PlanWaitsForOrchestrator, TicketAgentToWake, TicketCalled, TicketHandedIn, TicketNeedsLook,
                            TicketRestarted, TicketsDue, TicketToRevive, TicketWaitedLong)
from receiving import Handler
from resources.base import FINISHED, STUCK, Refused
from resources.types import Board, Ticket
from serving import Chat, Clock, Rows


class HoldTicketKnowledge(Handler[KnowledgeProposed]):
    def handle(self, event: KnowledgeProposed, tickets: Rows[Ticket]) -> list[Fact]:
        tickets.hold(event.type, event.n, event.owner)
        return []


class WakeTheTicketAgent(Handler[TicketAgentToWake]):
    def handle(self, event: TicketAgentToWake, tickets: Rows[Ticket]) -> list[Fact]:
        with suppress(Refused):
            tickets.tell(event.ticket, event.note)
        return []


class FinishTheBoardWithItsLastTicket(Handler[BoardOutOfTickets]):
    def handle(self, event: BoardOutOfTickets, boards: Rows[Board]) -> list[Fact]:
        boards.finish(event.board)
        return []


class LookAfterTickets(Handler[TicketsDue]):
    def handle(self, event: TicketsDue, tickets: Rows[Ticket]) -> list[Fact]:
        tickets.look_after()
        return []


class RaiseWaitingPlan(Handler[PlanWaitsForOrchestrator]):
    def handle(self, event: PlanWaitsForOrchestrator, tickets: Rows[Ticket]) -> list[Fact]:
        tickets.raise_moment(event.ticket, event.moment)
        return []


class PassOnCall(Handler[TicketCalled]):
    def handle(self, event: TicketCalled, chat: Chat) -> list[Fact]:
        chat.nudge(event.kind, ticket=event.ticket, title=event.title, **event.values)
        return []


class RecordHandedIn(Handler[TicketHandedIn]):
    def handle(self, event: TicketHandedIn, tickets: Rows[Ticket], clock: Clock) -> list[Fact]:
        tickets.update(event.ticket, handed_in_at=clock.now())
        tickets.raise_moment(event.ticket, FINISHED)
        return []


class ReviveTicket(Handler[TicketToRevive]):
    def handle(self, event: TicketToRevive, tickets: Rows[Ticket]) -> list[Fact]:
        if tickets.revive(tickets.load(event.ticket)):
            return [TicketRestarted(ticket=event.ticket, title=event.title)]
        return [TicketNeedsLook(ticket=event.ticket, text=event.text)]


class TellTicketRestarted(Handler[TicketRestarted]):
    def handle(self, event: TicketRestarted, chat: Chat) -> list[Fact]:
        chat.nudge("ticket_restarted", ticket=event.ticket, title=event.title)
        return []


class RaiseStuckTicket(Handler[TicketNeedsLook]):
    def handle(self, event: TicketNeedsLook, tickets: Rows[Ticket]) -> list[Fact]:
        tickets.raise_moment(event.ticket, STUCK, reason=event.text)
        return []


class CommentOnLongWait(Handler[TicketWaitedLong]):
    def handle(self, event: TicketWaitedLong, tickets: Rows[Ticket]) -> list[Fact]:
        tickets.comment(event.ticket, f"Its work has waited {event.minutes} minutes for the orchestrator to review, test and merge it.")
        return []
