from dataclasses import replace

from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.among import Among
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_nudges import WORKER_ASKING_STOPPED, WORKER_LIMIT_STOPPED
from suites.coding.modules.workers.support.worker_settings import MERGER_WAIT_MINUTES
from suites.coding.modules.workers.support.worker_started_work import WorkerStartedWork
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from suites.coding.models.enums.coding_helper_role import CodingHelperRole


class StoppedWorkerRule(DriverRule):
    """A tick names to the main agent, and again after the line's interval, each stopped worker with work left
    that nothing will start again: one whose question nobody answered, and one that used up its restarts. The
    merger has the wait setting's minutes first, and a worker a person or another agent stopped is left alone."""

    name = "workers.stopped-worker"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, stop: WorkerStop, unfinished: WorkerUnfinishedTasks, started_work: WorkerStartedWork, settings: SettingValues) -> None:
        self.queries, self.stop, self.unfinished, self.started_work, self.settings = queries, stop, unfinished, started_work, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        wait_seconds = self.settings.minutes(MERGER_WAIT_MINUTES).count
        due = [worker for worker in self.stopped_with_tasks() if worker.ended_at is not None and worker.ended_at.elapsed_seconds(hook.timestamp) >= wait_seconds]
        return RuleAnswer.with_nudges(*[nudge for nudge in map(self.nudge, due) if nudge is not None])

    def stopped_with_tasks(self) -> list[Agent]:
        tasks = self.queries.query(Task).matching(Among("state", [TaskState.OPEN, TaskState.STARTED])).matching(HasValue("delegated_to")).all_rows()
        assigned = {task.delegated_to for task in tasks}
        stopped = self.queries.query(Agent).filter(role=CodingHelperRole.WORKER).matching(HasValue("ended_at")).matching(IsNull("retired_at")).matching(IsNull("paused_at")).all_rows()
        return [worker for worker in stopped if worker.id in assigned]

    def nudge(self, worker: Agent) -> Nudge | None:
        worker_round = self.unfinished.steps.round(worker.id)
        tasks = self.unfinished.round_rows(worker_round)
        if not tasks:
            return None
        if not worker_round.is_asking and not self.started_work.reached_restart_limit(worker):
            return None
        if self.stop.was_stopped(worker):
            return None
        declaration = WORKER_ASKING_STOPPED if worker_round.is_asking else WORKER_LIMIT_STOPPED
        return replace(declaration.nudge(worker=worker.id, tasks=self.unfinished.names(tasks)), key=f"{declaration.key}.{worker.id}")
