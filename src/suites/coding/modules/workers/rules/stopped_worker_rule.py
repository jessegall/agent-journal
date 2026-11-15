from dataclasses import replace

from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from engine.setting.setting_values import SettingValues
from engine.driver.nudge_declaration import NudgeDeclaration
from suites.coding.modules.workers.support.escalations import Escalations
from suites.coding.modules.workers.support.worker_handoff import WorkerHandoff
from suites.coding.modules.workers.nudges.worker_asking_stopped_nudge import WorkerAskingStoppedNudge
from suites.coding.modules.workers.nudges.worker_limit_stopped_nudge import WorkerLimitStoppedNudge
from suites.coding.modules.workers.nudges.worker_process_ended_nudge import WorkerProcessEndedNudge
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_settings import MERGER_WAIT_MINUTES, WORKER_RUN_LIMIT
from suites.coding.modules.workers.support.worker_started_work import WorkerStartedWork
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks


class StoppedWorkerRule(DriverRule):
    """A tick names to the main agent, and again after the line's interval, each stopped worker with work left
    that nothing will start again: one whose question nobody answered, one that used up its restarts, and one
    whose process ended with no run and no hand-in of its own under way, as at a restart of the journal. A
    stopped worker whose question was passed on to the main agent is named until the main agent writes to it,
    also when all it holds are committed tasks that wait on a merge. The merger has the wait setting's minutes
    first, a worker a user or another agent stopped is left alone, and nothing is named while workers are
    switched off."""

    name = "workers.stopped-worker"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, stop: WorkerStop, unfinished: WorkerUnfinishedTasks, started_work: WorkerStartedWork, settings: SettingValues, handoff: WorkerHandoff, escalations: Escalations) -> None:
        self.handoff, self.escalations = handoff, escalations
        self.queries, self.stop, self.unfinished, self.started_work, self.settings = queries, stop, unfinished, started_work, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.settings.number(WORKER_RUN_LIMIT) == 0:
            return RuleAnswer.allowed()
        wait_seconds = self.settings.minutes(MERGER_WAIT_MINUTES).count
        stopped = [worker for worker in self.started_work.stopped_workers() if worker.ended_at is not None and worker.ended_at.elapsed_seconds(hook.timestamp) >= wait_seconds]
        with_tasks = {worker.id for worker in self.started_work.with_tasks(stopped)}
        named = [nudge for nudge in map(self.nudge, [worker for worker in stopped if worker.id in with_tasks]) if nudge is not None]
        named_keys = {nudge.key for nudge in named}
        asking = [self.asking_nudge(worker) for worker in stopped if self.escalations.is_open(worker.id) and not self.stop.was_stopped(worker)]
        return RuleAnswer.with_nudges(*named, *[nudge for nudge in asking if nudge.key not in named_keys])

    # a worker whose question the main agent has, named with every task it holds that is not done, committed ones too
    def asking_nudge(self, worker: Agent) -> Nudge:
        tasks = {task.id: task for task in (*self.unfinished.rows(worker.id), *self.unfinished.committed(worker.id))}
        return replace(WorkerAskingStoppedNudge.declared().nudge(worker=worker.number, tasks=self.unfinished.names(tuple(tasks.values()))), key=f"{WorkerAskingStoppedNudge.declared().key}.{worker.id}")

    def nudge(self, worker: Agent) -> Nudge | None:
        worker_round = self.unfinished.steps.round(worker.id)
        tasks = self.unfinished.round_rows(worker_round)
        if not tasks:
            return None
        if self.stop.was_stopped(worker) or self.unfinished.has_running_process(worker.id) or self.handoff.is_pending(worker):
            return None
        declaration = self.declaration(worker, worker_round)
        return replace(declaration.nudge(worker=worker.number, tasks=self.unfinished.names(tasks)), key=f"{declaration.key}.{worker.id}")

    def declaration(self, worker: Agent, worker_round: WorkerRound) -> NudgeDeclaration:
        if worker_round.is_asking:
            return WorkerAskingStoppedNudge.declared()
        return WorkerLimitStoppedNudge.declared() if self.started_work.reached_restart_limit(worker) else WorkerProcessEndedNudge.declared()
