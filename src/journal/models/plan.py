from dataclasses import dataclass
from typing import ClassVar

from journal.models.plan_state import PlanState
from journal.events.rows.plan_abandoned import PlanAbandoned
from journal.events.rows.plan_approved import PlanApproved
from journal.events.rows.plan_blocked import PlanBlocked
from journal.events.rows.plan_postponed import PlanPostponed
from journal.events.rows.plan_reopened import PlanReopened
from journal.events.rows.plan_done import PlanDone
from journal.events.rows.plan_started import PlanStarted
from journal.models.scoped import Scoped
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.models.phase_tasks import PhaseTasks
from journal.models.support.dock_button import DockButton
from journal.models.support.dock_card import DockCard
from journal.support.refused import Refused


@dataclass(frozen=True)
class Plan(Scoped):
    """Ordered work: its phases and tasks are linked to it. Built as draft, made ready by the agent, held in review while reviewers read it, counting those still out, approved by the user, then followed: finishing one task starts the next. A start is refused while it is blocked or unapproved; a done plan given work again is reopened without that check. Its questions about its tasks are answered over the rows its repository hands it: finished when every task is closed, all left blocked, the tasks in order phase by phase then the loose ones, the next open task that can start, the task to resume (its postponed one first), the current phase (the first with open work, else the last) and the checkpoint it stands at (a checkpoint phase done, the next phase's work not begun)."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief")

    title: str = ""
    brief: str = ""
    state: PlanState = PlanState.DRAFT
    blocked_why: str = ""
    reviewers: int = 0

    def ready(self) -> "Plan":
        return self.moved(PlanState.READY)

    def reviewing(self) -> "Plan":
        return self.moved(PlanState.REVIEWING)

    def approved(self, time: float, by_user: bool) -> "Plan":
        return self.moved(PlanState.APPROVED).with_event(PlanApproved(environment_id=self.environment_id, time=time, plan_id=self.id, by_user=by_user))

    def startable(self) -> "Plan":
        if self.is_blocked():
            raise Refused(f"plan {self.id} is blocked, waiting on: {self.blocked_why or 'what it was blocked on'}; `journal plan unblock {self.id}` when it may go on")
        if not self.state.can_be_started():
            raise Refused(f"plan {self.id} is {self.state}, not approved: the user approves it first")
        return self

    def started(self, first: Task, time: float) -> "Plan":
        return self.startable().moved(PlanState.STARTED).with_event(PlanStarted(environment_id=self.environment_id, time=time, plan_id=self.id, task_id=first.id))

    def started_without_task(self, time: float) -> "Plan":
        return self.startable().reopened(time)

    def reopened(self, time: float) -> "Plan":
        return self.moved(PlanState.STARTED).with_event(PlanStarted(environment_id=self.environment_id, time=time, plan_id=self.id, task_id=0))

    def postponed(self, time: float, by_user: bool) -> "Plan":
        return self.moved(PlanState.SUSPENDED).with_event(PlanPostponed(environment_id=self.environment_id, time=time, plan_id=self.id, by_user=by_user))

    def blocked(self, why: str, time: float) -> "Plan":
        return self.moved(PlanState.BLOCKED).with_(blocked_why=why).with_event(PlanBlocked(environment_id=self.environment_id, time=time, plan_id=self.id, why=why))

    def unblocked(self, why: str, time: float) -> "Plan":
        return self.moved(PlanState.STARTED).with_(blocked_why="").with_event(PlanReopened(environment_id=self.environment_id, time=time, plan_id=self.id, why=why))

    def is_blocked(self) -> bool:
        return self.state == PlanState.BLOCKED

    def done(self, time: float) -> "Plan":
        return self.moved(PlanState.FINISHED).with_event(PlanDone(environment_id=self.environment_id, time=time, plan_id=self.id))

    def cancelled(self, time: float, by_user: bool) -> "Plan":
        return self.moved(PlanState.CANCELLED).with_event(PlanAbandoned(environment_id=self.environment_id, time=time, plan_id=self.id, by_user=by_user))

    def moved(self, state: PlanState) -> "Plan":
        if not self.state.can_become(state):
            raise Refused(f"plan {self.id} is {self.state} and cannot become {state}")
        return self.with_(state=state)

    def is_finished(self, tasks: list[Task]) -> bool:
        return bool(tasks) and all(task.is_closed() for task in tasks)

    def is_all_left_blocked(self, tasks: list[Task]) -> bool:
        left = [task for task in tasks if not task.is_closed()]
        return bool(left) and all(task.state == TaskState.BLOCKED for task in left)

    def in_order(self, phases: list[PhaseTasks], tasks: list[Task]) -> list[Task]:
        phased = [task for phase in phases for task in phase.tasks]
        ids = {task.id for task in phased}
        return phased + [task for task in tasks if task.id not in ids]

    def next_open_task(self, in_order: list[Task], cannot_start: set[int]) -> Task | None:
        return next((task for task in in_order if task.state == TaskState.OPEN and task.id not in cannot_start), None)

    def task_to_resume(self, in_order: list[Task], cannot_start: set[int]) -> Task | None:
        return next((task for task in in_order if task.state == TaskState.SUSPENDED), None) or self.next_open_task(in_order, cannot_start)

    def current_phase(self, phases: list[PhaseTasks]) -> int:
        return next((phase.number for phase in phases if phase.has_open_work()), len(phases) or 1)

    def checkpoint_at(self, phases: list[PhaseTasks]) -> PhaseTasks | None:
        for before, after in zip(phases, phases[1:]):
            if before.phase.checkpoint and before.is_done() and after.tasks and not after.has_work_started():
                return before
        return None

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.first_line(self.brief)

    def docked(self) -> DockCard:
        return DockCard((DockButton("Open plan", "open"), DockButton("Approve", "approve"), DockButton("Close", "close")))
