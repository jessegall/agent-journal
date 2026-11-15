from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from core.modules.triggers.support.phrase_trigger_match import PHRASE_TRIGGER_KEY, PhraseTriggerMatch


class PhraseTriggerEffect(EventEffect):
    """Counts each trigger that acted as fired and requests the skill a trigger asks for."""

    key = PHRASE_TRIGGER_KEY
    events = [HookEventName.PROMPT, HookEventName.PRE_TOOL_USE]
    role_group = RoleGroup.PROMPT

    def __init__(self, match: PhraseTriggerMatch) -> None:
        self.match = match

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.match.answer(event, agent_id).commands if event is not None else []
