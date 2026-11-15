from engine.command.command import Command
from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher import StopUnusedLauncher
from core.modules.agents.support.launcher_processes import LauncherProcesses


class UnusedLauncherEffect(EventEffect):
    """On a main agent's tick, has each second launcher of this journal that serves nobody told to the user
    and stopped."""

    key = "agents.unused-launcher"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, processes: LauncherProcesses) -> None:
        self.processes = processes

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [*(StopUnusedLauncher(serving.pid, unused.pid) for serving, unused in self.processes.unused())]
