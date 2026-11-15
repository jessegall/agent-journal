from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.triggers.support.phrase_trigger_match import PHRASE_TRIGGER_KEY, PhraseTriggerMatch


class PhraseTriggerLines(EventLineSource):
    """The text of each trigger whose words appear where it watches, and at a prompt the skill one asks for."""

    key = PHRASE_TRIGGER_KEY
    events = [HookEventName.PROMPT, HookEventName.PRE_TOOL_USE]
    role_group = RoleGroup.PROMPT

    def __init__(self, match: PhraseTriggerMatch) -> None:
        self.match = match

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return self.match.answer(event, agent_id).nudges if event is not None else []
