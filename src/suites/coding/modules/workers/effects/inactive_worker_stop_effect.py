from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker import EndInactiveWorker
from suites.coding.modules.workers.lines.inactive_worker_stop_lines import IDLE_WORKER_STOP_KEY
from suites.coding.modules.workers.support.idle_workers import IdleWorkers


class InactiveWorkerStopEffect(EventEffect):
    """At the main agent's minute step, stops the process of each of its workers that has used no tool for the hours
    the setting gives and has delivered nothing. The worker stays kept: its task, its worktree and its session stay."""

    key = IDLE_WORKER_STOP_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, idle: IdleWorkers) -> None:
        self.idle_workers = idle

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [EndInactiveWorker(worktree.session_agent_id) for worktree in self.idle_workers.idle(event, agent_id)]
