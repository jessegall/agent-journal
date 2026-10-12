"""The moments of the ticket resource type."""

from dataclasses import dataclass
from typing import ClassVar

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
