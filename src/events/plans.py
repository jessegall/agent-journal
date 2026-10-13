"""The moments of the plan resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class PlanCreated(ResourceEvent):
    on: ClassVar[str] = "plan.created"


@dataclass(frozen=True)
class PlanUpdated(ResourceEvent):
    on: ClassVar[str] = "plan.updated"


@dataclass(frozen=True)
class PlanCompleted(ResourceEvent):
    on: ClassVar[str] = "plan.completed"


@dataclass(frozen=True)
class PlanChanged(ResourceEvent):
    on: ClassVar[str] = "plan"
    status: str = ""
    parked_for: int = 0


@dataclass(frozen=True, kw_only=True)
class PlanBuildBegun(Fact):
    """The user made a plan, which the agent is to build."""

    plan: int
    title: str
    depth: str


@dataclass(frozen=True, kw_only=True)
class PlanApproved(Fact):
    """The plan was approved and waits to be started."""

    plan: int
    title: str


@dataclass(frozen=True, kw_only=True)
class PlanMovedByUser(Fact):
    """The user parked a plan or picked it up again; `line` says which."""

    line: str
    plan: int
    title: str
    phase: int


@dataclass(frozen=True, kw_only=True)
class PlanBuildingGuided(Fact):
    """What the agent is to do next to the plan it is building."""

    plan: int
    line: str


@dataclass(frozen=True, kw_only=True)
class PlanHandedToHelper(Fact):
    """A to-do of the plan's current phase was handed to a helper, so the plan runs delegated."""

    plan: int


@dataclass(frozen=True, kw_only=True)
class CheckpointPassed(Fact):
    """A plan waits at a checkpoint that auto mode passes by itself."""

    plan: int


@dataclass(frozen=True, kw_only=True)
class PlansToAdvance(Fact):
    """A row of a plan closed or the plan changed: the running plans walk on as far as their closed rows allow."""

    passing: bool


@dataclass(frozen=True, kw_only=True)
class PlanRowReopened(Fact):
    """A row of a plan's earlier phase was reopened, so the plan goes back to that phase."""

    plan: int
    type: str
    n: int
    phase: int
    was_done: bool


@dataclass(frozen=True, kw_only=True)
class DeletedRowOnPlan(Fact):
    """A to-do that was deleted still sits on a plan's phase, so it leaves it and the plan no longer counts it."""

    plan: int
    phase: int
    todo: int


@dataclass(frozen=True, kw_only=True)
class StruckRowInUnapprovedPlan(Fact):
    """A to-do struck off sits in a plan nobody approved, so it leaves the phase."""

    plan: int
    phase: int
    todo: int


@dataclass(frozen=True, kw_only=True)
class ReviewReportLinked(Fact):
    """The report a plan was waiting on in review is linked, so the plan goes back to building."""

    plan: int


@dataclass(frozen=True, kw_only=True)
class ReviewEndedWithReport(Fact):
    """The agent is told its plan's review ended with a report."""

    plan: int
    title: str
    report: int
