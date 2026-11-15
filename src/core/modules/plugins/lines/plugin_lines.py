from engine.agent.enums.role_group import RoleGroup
from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.plugins.support.plugin_hook_run import PLUGIN_RULE_NAME, PluginHookRun


class PluginLines(EventLineSource):
    """The line of a plugin that refused the hook; the plugins' other lines are recorded as notices by the effect."""

    key = PLUGIN_RULE_NAME
    events = list(HookEventName)
    role_group = RoleGroup.PLUGIN

    def __init__(self, run: PluginHookRun) -> None:
        self.run = run

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        refusal = self.run.answer(event, agent_id).refusal
        return [refusal] if refusal is not None else []
