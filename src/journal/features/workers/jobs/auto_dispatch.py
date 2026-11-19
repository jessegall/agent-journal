from journal.engine.job import Job
from journal.features.workers.support.orchestrator_task_assigner import OrchestratorTaskAssigner
from journal.features.workers.support.work_mode import WorkMode
from journal.features.workers.support.worker_dispatch import WorkerDispatch
from journal.features.workers.workers_options import WorkersOptions
from journal.models.agent import Agent
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.models.support.ref import Ref
from journal.support.missing_row import MissingRow
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.plans import Plans
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.rejection import Rejection
from journal.support.time_source import TimeSource

# the profile a worker the journal sends takes when no worker was sent here before it
FIRST_PROFILE = "journal-medior"
# a worker in one of these states holds no task any more
LET_GO = (WorkerState.MERGED, WorkerState.RELEASED)


class AutoDispatch(Job):
    """Every thirty seconds, in every environment whose work mode delegates the work and whose user switched the journal's own dispatch on, sends a worker on each next task the orchestrator's assigner would hand out, while fewer workers run than the journal keeps running: in the orchestrator's name with no session awaiting it, shaped as the last worker sent here, its profile, program, worktree and library folders; never on a blocked, delegated or manual task, one with no brief, or one in a phase after the one at work, each read again just before its send so a task the orchestrator took meanwhile is passed over; a send that is refused leaves the task to the orchestrator, marked manual, the refusal in its log."""

    interval_seconds = 30.0

    def __init__(self, environments: Environments, scope: Scope, settings: SettingRows, work_mode: WorkMode, assigner: OrchestratorTaskAssigner, plans: Plans, workers: Workers, agents: Agents, tasks: Tasks, logs: TaskLogs, sending: WorkerDispatch, providers: Providers, time_source: TimeSource) -> None:
        self.environments, self.scope, self.settings, self.work_mode, self.assigner = environments, scope, settings, work_mode, assigner
        self.plans, self.workers, self.agents, self.tasks, self.logs, self.sending, self.providers, self.time_source = plans, workers, agents, tasks, logs, sending, providers, time_source

    def tick(self, time: float) -> None:
        for environment in self.environments.rows():
            with self.scope.environment(environment.row_id):
                orchestrator = next((agent for agent in self.agents.unended_scoped(environment.row_id) if agent.is_main()), None)
                if orchestrator is not None and self.settings.option(WorkersOptions.AUTO_DISPATCH) and self.work_mode.delegates_work():
                    self.filled(orchestrator, time)

    def filled(self, orchestrator: Agent, time: float) -> None:
        self.unstranded()
        offers = self.dispatchable(time)
        limit = self.settings.integer(WorkersOptions.AUTO_DISPATCH_LIMIT) or self.settings.integer(WorkersOptions.WORKER_LIMIT)
        places = limit - self.workers.dispatched_count() if limit else len(offers)
        if limit and self.settings.option(WorkersOptions.AUTO_DISPATCH_UNQUEUE) and places > len(offers):
            self.unqueued(places - len(offers))
        for task in offers[:max(places, 0)]:
            current = self.tasks.find(task.row_id)
            if current.is_assignable():
                self.sent(current, orchestrator)

    def unstranded(self) -> None:
        """An open task still marked delegated that no worker holds any more, its last one merged or released or gone, is nobody's: on the hosted journal 17 such tasks sat for days (19 Nov), skipped here and taken by the orchestrator for handed out. Its mark is cleared, so it is handed out again."""
        for task in self.tasks.open_delegated():
            if not any(self.holds(holder) for holder in self.tasks.holders(task)):
                self.tasks.save(task.with_(delegated=False), Actor.system())
                self.logs.save(TaskLog.build(task, "no worker holds it any more, so the journal hands it out again", self.time_source.seconds()), Actor.system())

    def unqueued(self, places: int) -> None:
        """Takes up to places tasks that wait in a busy worker's queue, and wait on nothing else, out of it, oldest queued first,
        so they go out to workers of their own at the next round: on the hosted journal four open tasks sat behind two busy
        workers while 18 of 30 places stood free (19 Nov)."""
        taken, later = 0, self.plans.later_phase_task_ids()
        for task in self.tasks.open_delegated():
            if task.row_id in later:
                continue
            if taken >= places:
                return
            holders = self.tasks.holders(task)
            if not holders or not all(self.holds(holder) for holder in holders) or self.tasks.open_waits(task):
                continue
            if self.tasks.unqueued_task(task, Actor.system()):
                self.logs.save(TaskLog.build(task, "taken out of a busy worker's queue so a worker of its own takes it", self.time_source.seconds()), Actor.system())
                taken += 1

    def holds(self, holder: Ref) -> bool:
        if holder.type != Worker.table():
            return True
        try:
            return self.workers.find(holder.id).state not in LET_GO
        except MissingRow:
            return False

    def dispatchable(self, time: float) -> list[Task]:
        offers = self.assigner.offers()
        later = self.plans.later_phase_task_ids()
        return [task for task in offers if task.is_assignable() and not task.manual and task.row_id not in later and self.settled(task, time)]

    def settled(self, task: Task, time: float) -> bool:
        """Whether the orchestrator had its grace to finish setting the task up: a task it just made or changed is left alone."""
        grace = self.settings.integer(WorkersOptions.AUTO_DISPATCH_GRACE)
        touched = max((moment.timestamp() for moment in (task.created_at, task.updated_at) if moment), default=0.0)
        return grace <= 0 or time - touched >= grace

    def sent(self, task: Task, orchestrator: Agent) -> None:
        try:
            self.sending.sent(self.workers.save(self.sending.shaped(self.shape(), task, orchestrator.session), Actor.system()), task, Actor.system(), Worker.auto_dispatched)
        except Rejection as refused:
            self.tasks.save(self.tasks.find(task.row_id).kept_by_hand(), Actor.system())
            self.logs.save(TaskLog.build(task, f"the journal could not dispatch it, so it is left to you: {refused}", self.time_source.seconds()), Actor.system())

    def shape(self) -> Worker:
        last = self.workers.scoped_page(1)
        return last[0] if last and last[0].profile else Worker(profile=FIRST_PROFILE, provider=self.providers.default().name, worktree=True)
