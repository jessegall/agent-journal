from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.commands.send_silent_agent_lines.send_silent_agent_lines import SendSilentAgentLines
from suites.coding.modules.workers.lines.inactive_helper_lines import INACTIVE_HELPER_KEY
from suites.coding.modules.workers.types.worker import Worker


class InactiveHelperEffect(EventEffect):
    """At each minute step of the main agent or a worker, sends the lines that wake its silent helpers."""

    key = INACTIVE_HELPER_KEY
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value, Worker.key]

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [SendSilentAgentLines()]
