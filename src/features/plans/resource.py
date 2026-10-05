from dataclasses import dataclass
from typing import ClassVar

from resources.base import DOCUMENT, SIDEBAR, Resource, ResourceDetails
from resources.shapes import FLAG, NUMBER, Field, Shape, names

PHASE = names("title", "when", "checkpoint", "brief", "todos", "tickets")
PHASE_FIELDS = {"todo": PHASE.todos, "ticket": PHASE.tickets}
MUST_HAVE = "Must have"
BUILDING, DRAFT, READY, APPROVED, ACTIVE, WAITING, PARKED, DONE, ABANDONED = (
    "building", "draft", "ready", "approved", "active", "waiting", "parked", "done", "abandoned"
)
RUNNING = (ACTIVE, WAITING)
ENDED = (DONE, ABANDONED)


@dataclass(frozen=True)
class Placement:
    n: int
    title: str
    phase: int
    holds: bool


class Plan(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="status"),
        Field(name="stage"),
        Field(default=list, name="phases"),
        Field(default=1, name="current"),
        Field(default="normal", name="depth"),
        Field(FLAG, False, name="dismissed"),
        Field(default="each", name="worktree"),
        Field(name="branch"),
        Field(NUMBER, 0.0, name="merged"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Plan",
        abstract="Ordered phases of to-dos with a goal, approved by the user before it runs",
        help="A plan is drafted by the agent, approved and continued by the user, and worked phase by phase. While it is being written the agent says which stage it is at with journal plan stage <n> phases|todos, so the viewer knows whether the phases or the rows under them are still to come. journal plan build takes a plan that is ready back to being written, for when there is more to add.",
    )
    listed_open = True
    choices = {"worktree": ["each", "shared"]}
    type = "plan"
    notify_actions = ("updated",)
    event_labels = {"created": "Plan started", "completed": "Plan closed"}
    labels = {"abstract": "One line: what is true when it is done", "brief": "What you want, in your own words; the agent builds the plan with you from here"}
    status_labels = {"complete": "finishing"}
    start_heading = "PLANS running"
    needs_attention = True
    lists_completed_unread = True
    icon = "flag"
    listed_under = SIDEBAR
    command_names = {"complete": "finish", "place": "todos", "resume": "continue"}
    view = DOCUMENT

    @property
    def current_phase(self) -> dict | None:
        return self.phases[self.current - 1] if 0 < self.current <= len(self.phases) else None

    def phase_of(self, kind: str, n: int) -> int:
        field = PHASE_FIELDS[kind]
        return next((i for i, phase in enumerate(self.phases, 1) if n in phase.get(field, [])), 0)

    def empty_phases(self) -> list[int]:
        return [i for i, phase in enumerate(self.phases, 1) if not any(phase.get(field) for field in PHASE_FIELDS.values())]

    def placement(self, todo) -> Placement | None:
        number = self.phase_of("todo", todo.n)
        if self.status in ENDED or not number:
            return None
        phase = self.current_phase
        holds = self.status != ACTIVE or phase is None or todo.n not in phase[PHASE.todos]
        return Placement(self.n, self.title, number, holds)

    def start_line(self) -> str:
        phase = self.current_phase
        return f"{self.title} is {self.status} — phase {self.current}, {phase[PHASE.title] if phase else ''}"

    def member_refs(self) -> list[str]:
        return [f"todo:{n}" for phase in self.phases for n in phase.get(PHASE.todos, [])]
