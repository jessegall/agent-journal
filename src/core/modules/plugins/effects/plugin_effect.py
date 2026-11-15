from engine.agent.enums.role_group import RoleGroup
from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.plugins.support.plugin_hook_run import PLUGIN_RULE_NAME, PluginHookRun


class PluginEffect(EventEffect):
    """Delivers the hook to the plugins that hear it, records their lines and drains their queues."""

    key = PLUGIN_RULE_NAME
    events = list(HookEventName)
    role_group = RoleGroup.PLUGIN

    def __init__(self, run: PluginHookRun) -> None:
        self.run = run

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.run.answer(event, agent_id).commands
