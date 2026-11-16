from engine.time.clock import Clock
from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from dataclasses import replace

from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.driver.agent_message import AgentMessage
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from engine.setting.setting_values import SettingValues
from engine.driver.message_template import MessageTemplate
from suites.coding.modules.workers.support.escalations import Escalations
from suites.coding.modules.workers.support.worker_handoff import WorkerHandoff
from suites.coding.modules.workers.agent_messages.worker_asking_stopped_message import WorkerAskingStoppedMessage
from suites.coding.modules.workers.agent_messages.worker_limit_stopped_message import WorkerLimitStoppedMessage
from suites.coding.modules.workers.agent_messages.worker_process_ended_message import WorkerProcessEndedMessage
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_settings import MERGER_WAIT_MINUTES, WORKER_RUN_LIMIT
from suites.coding.modules.workers.support.worker_started_work import WorkerStartedWork
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks


class StoppedWorkerLines(EventLineSource):
    """A tick names to the main agent, and again after the line's interval, each stopped worker with work left
    that nothing will start again: one whose question nobody answered, one that used up its restarts, and one
    whose process ended with no run and no hand-in of its own under way, as at a restart of the journal. A
    stopped worker whose question was passed on to the main agent is named until the main agent writes to it,
    also when all it holds are committed tasks that wait on a merge. The merger has the wait setting's minutes
    first, a worker a user or another agent stopped is left alone, and nothing is named while workers are
    switched off."""

    key = "workers.stopped-worker"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries, stop: WorkerStop, unfinished: WorkerUnfinishedTasks, started_work: WorkerStartedWork, settings: SettingValues, handoff: WorkerHandoff, escalations: Escalations, clock: Clock) -> None:
        self.handoff, self.escalations = handoff, escalations
        self.queries, self.stop, self.unfinished, self.started_work, self.settings = queries, stop, unfinished, started_work, settings
        self.clock = clock

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if self.settings.number(WORKER_RUN_LIMIT) == 0:
            return []
        wait_seconds = self.settings.minutes(MERGER_WAIT_MINUTES).count
        stopped = [worker for worker in self.started_work.stopped_workers() if worker.ended_at is not None and worker.ended_at.elapsed_seconds(self.clock.timestamp()) >= wait_seconds]
        with_tasks = {worker.id for worker in self.started_work.with_tasks(stopped)}
        listed = [agent_message for agent_message in map(self.agent_message, [worker for worker in stopped if worker.id in with_tasks]) if agent_message is not None]
        listed_keys = {agent_message.key for agent_message in listed}
        asking = [self.asking_agent_message(worker) for worker in stopped if self.escalations.is_open(worker.id) and not self.stop.was_stopped(worker)]
        return [*listed, *[agent_message for agent_message in asking if agent_message.key not in listed_keys]]

    def asking_agent_message(self, worker: Agent) -> AgentMessage:
        tasks = {task.id: task for task in (*self.unfinished.rows(worker.id), *self.unfinished.committed(worker.id))}
        return replace(WorkerAskingStoppedMessage.declared().agent_message(worker=worker.number, tasks=self.unfinished.names(tuple(tasks.values()))), key=f"{WorkerAskingStoppedMessage.declared().key}.{worker.id}")

    def agent_message(self, worker: Agent) -> AgentMessage | None:
        worker_round = self.unfinished.steps.round(worker.id)
        tasks = self.unfinished.round_rows(worker_round)
        if not tasks:
            return None
        if self.stop.was_stopped(worker) or self.unfinished.has_running_process(worker.id) or self.handoff.is_pending(worker):
            return None
        declaration = self.declaration(worker, worker_round)
        return replace(declaration.agent_message(worker=worker.number, tasks=self.unfinished.names(tasks)), key=f"{declaration.key}.{worker.id}")

    def declaration(self, worker: Agent, worker_round: WorkerRound) -> MessageTemplate:
        if worker_round.is_asking:
            return WorkerAskingStoppedMessage.declared()
        return WorkerLimitStoppedMessage.declared() if self.started_work.reached_restart_limit(worker) else WorkerProcessEndedMessage.declared()
