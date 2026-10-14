"""The moments of the ticket resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class TicketCreated(ResourceEvent):
    on: ClassVar[str] = "ticket.created"


@dataclass(frozen=True)
class TicketUpdated(ResourceEvent):
    on: ClassVar[str] = "ticket.updated"


@dataclass(frozen=True)
class TicketCompleted(ResourceEvent):
    on: ClassVar[str] = "ticket.completed"


@dataclass(frozen=True)
class TicketPlanWaits(ResourceEvent):
    on: ClassVar[str] = "ticket.plan_waits"


@dataclass(frozen=True)
class TicketCheckpoint(ResourceEvent):
    on: ClassVar[str] = "ticket.checkpoint"


@dataclass(frozen=True)
class TicketFinished(ResourceEvent):
    on: ClassVar[str] = "ticket.finished"


@dataclass(frozen=True)
class TicketStuck(ResourceEvent):
    on: ClassVar[str] = "ticket.stuck"


@dataclass(frozen=True)
class TicketEscalated(ResourceEvent):
    on: ClassVar[str] = "ticket.escalated"


@dataclass(frozen=True, kw_only=True)
class KnowledgeProposed(Fact):
    """A rule, doc or tool written in a ticket's environment, which counts once the ticket's branch is merged."""

    type: str
    n: int
    owner: str


@dataclass(frozen=True, kw_only=True)
class TicketAgentToWake(Fact):
    """A question a ticket's agent asked was answered, so the agent is told the answer."""

    ticket: int
    note: str


@dataclass(frozen=True, kw_only=True)
class BoardOutOfTickets(Fact):
    """The last ticket of a started board was closed."""

    board: int


@dataclass(frozen=True, kw_only=True)
class PlanWaitsForOrchestrator(Fact):
    """A ticket's plan waits for the agent orchestrating the ticket's board, at this moment of the plan."""

    ticket: int
    moment: str


@dataclass(frozen=True, kw_only=True)
class TicketCalled(Fact):
    """Something a ticket's agent did or says that the agent orchestrating its board is told, under this line."""

    kind: str
    ticket: int
    title: str
    values: dict


@dataclass(frozen=True, kw_only=True)
class TicketHandedIn(Fact):
    """A ticket's plan is done and its work waits for the orchestrator."""

    ticket: int


@dataclass(frozen=True, kw_only=True)
class TicketToRevive(Fact):
    """A ticket's agent stopped and the ticket may start it again."""

    ticket: int
    title: str
    text: str


@dataclass(frozen=True, kw_only=True)
class TicketRestarted(Fact):
    """A ticket's stopped agent was started again."""

    ticket: int
    title: str


@dataclass(frozen=True, kw_only=True)
class TicketNeedsLook(Fact):
    """A ticket's agent is stuck in a way the orchestrator should look at."""

    ticket: int
    text: str


@dataclass(frozen=True, kw_only=True)
class TicketWaitedLong(Fact):
    """A ticket's finished work has waited this many minutes for the orchestrator."""

    ticket: int
    minutes: int


@dataclass(frozen=True, kw_only=True)
class TicketsDue(Fact):
    """The tickets trigger says it is time to look after the tickets."""

    agent: int
