from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.plugins.support.plugin_hook_run import PLUGIN_RULE_NAME, PluginHookRun


class PluginPolicy(EventPolicy):
    """A hook a plugin's guard refuses is refused with the plugin's line."""

    key = PLUGIN_RULE_NAME
    rank = "plugins.policies"
    events = list(HookEventName)
    role_group = RoleGroup.PLUGIN

    def __init__(self, run: PluginHookRun) -> None:
        self.run = run

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        return self.run.answer(event, agent_id).refusal
