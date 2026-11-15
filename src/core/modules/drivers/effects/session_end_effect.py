from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.agents.commands.end_agent.end_agent import EndAgent


class SessionEndEffect(EventEffect):
    """A session that ends ends its agent, so it names no caller any more. A clear under a launch ends no agent:
    the program goes on under a new session id, which its next hook binds to the same agent."""

    key = "drivers.session-end"
    events = [HookEventName.SESSION_END]

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        if event is None or event.is_launch_clear_end:
            return []
        return [EndAgent(agent_id)]
