from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.triggers.support.phrase_trigger_match import PHRASE_TRIGGER_KEY, PhraseTriggerMatch


class PhraseTriggerPolicy(EventPolicy):
    """A prompt or a tool call whose words a denying trigger watches is refused with the trigger's line."""

    key = PHRASE_TRIGGER_KEY
    rank = "triggers.policies"
    events = [HookEventName.PROMPT, HookEventName.PRE_TOOL_USE]
    role_group = RoleGroup.PROMPT

    def __init__(self, match: PhraseTriggerMatch) -> None:
        self.match = match

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        return self.match.answer(event, agent_id).refusal
