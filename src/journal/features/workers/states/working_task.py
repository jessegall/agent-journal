from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.command_ended import CommandEnded
from journal.events.agent.impasse_report import ImpasseReport
from journal.events.agent.wait_request import WaitRequest
from journal.events.agent.stop import Stop
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.worker_delivered import WorkerDelivered
from journal.events.rows.worker_review_requested import WorkerReviewRequested
from journal.events.rows.worker_silent import WorkerSilent
from journal.features.tasks.states.external_wait import ExternalWait
from journal.features.tasks.states.impasse import Impasse
from journal.features.tasks.tasks_part import TasksPart
from journal.features.workers.listeners.worker_task_changes import RELEASING
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.workers_options import WorkersOptions
from journal.support.classification import BUILD, JOURNAL, TEST_RUN
from journal.features.workers.workers_part import WorkersPart
from journal.features.workers.session_workers_part import SessionWorkersPart

KIND_REFUSALS = {TEST_RUN: WorkersNudges.TEST_QUEUE, BUILD: WorkersNudges.BUILD_QUEUE}


@dataclass(frozen=True)
class WorkingTask(BaseState):
    """A worker at work on its task, pushed over Void when it clocks in, or at its session's first hook while it is out on the task it holds, and popped back to Void when its work is delivered, sent to review, or its task is closed by the user: its writes wait while the journal rebases its worktree, it never runs git, it runs only the kinds of command the setting allows, a test or a build refused with the line to queue it with the journal, its stop is held until it clocks out, told the output of its own still running or the to-do items still open, it is told the end of each of its outputs, its journal await and journal stuck push the wait and the stuck state over its work, and a quiet span past its length tells it to log."""

    name = "working_task"
    title = "At work on its task"
    task_id: int = 0

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        rows = event.data.part(SessionWorkersPart).session_workers
        if event.call.writes and rows and rows[0].edit_lock:
            return self.refuse(WorkersNudges.EDIT_LOCK.create())
        if any(part.is_git for part in event.call.parts):
            return self.refuse(WorkersNudges.WORKER_GIT_REFUSAL.create())
        allowed = {JOURNAL, *(kind.strip() for kind in str(settings.value(WorkersOptions.COMMAND_KINDS)).split(","))}
        refused = next((part for part in event.call.parts if not part.is_journal and part.classification.command_type not in allowed), None)
        return self.refuse(KIND_REFUSALS.get(refused.classification.command_type, WorkersNudges.COMMAND_KIND_REFUSAL).create(command=refused.text)) if refused else self.none()

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        unfinished = event.data.part(SessionWorkersPart).unfinished_outputs
        if unfinished:
            return self.refuse(WorkersNudges.OUTPUT_UNFINISHED.create(n=unfinished[0]))
        items = [item for item in event.data.part(SessionWorkersPart).todos if not item.complete]
        if items:
            return self.refuse(WorkersNudges.OPEN_TODOS.create(count=len(items), items="; ".join(f"{item.position}. {item.text}" for item in items)))
        return self.refuse(WorkersNudges.CLOCK_OUT_DUE.create(task=self.task_id))

    def on_worker_silent(self, event: WorkerSilent, settings: Settings) -> Transition:
        return self.none(WorkersNudges.WORKER_LOG_DUE.create(minutes=event.minutes)) if event.worker.session == event.session else self.none()

    def on_command_ended(self, event: CommandEnded, settings: Settings) -> Transition:
        return self.none(WorkersNudges.OUTPUT_END.create(n=event.output, status=event.status))

    def on_wait_request(self, event: WaitRequest, settings: Settings) -> Transition:
        return self.push(ExternalWait.opened(*event.wait_terms()))

    def on_impasse_report(self, event: ImpasseReport, settings: Settings) -> Transition:
        return self.push(Impasse(reason=event.reason))

    def on_task_closed(self, event: TaskClosed, settings: Settings) -> Transition:
        if event.task_id not in event.data.part(TasksPart).agent_tasks or event.outcome not in RELEASING:
            return self.none()
        return self.pop(WorkersNudges.USER_CLOSURE.create(task=event.task_id))

    def on_worker_delivered(self, event: WorkerDelivered, settings: Settings) -> Transition:
        return self.pop() if is_mine(event) else self.none()

    def on_worker_review_requested(self, event: WorkerReviewRequested, settings: Settings) -> Transition:
        return self.pop() if is_mine(event) else self.none()


def is_mine(event: WorkerDelivered | WorkerReviewRequested) -> bool:
    return event.worker.id in {worker.id for worker in event.data.part(SessionWorkersPart).session_workers}
