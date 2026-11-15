from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.triggers.nudges.trigger_line_nudge import TriggerLineNudge
from core.modules.triggers.support.due_triggers import DueTriggers

SCHEDULED_TRIGGER_KEY = "triggers.scheduled"


class ScheduledTriggerLines(EventLineSource):
    """On any hook, and at the minute step, the main agent is given the text of each scheduled trigger whose time
    has come and that passes its conditions."""

    key = SCHEDULED_TRIGGER_KEY
    events = list(HookEventName)
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, due: DueTriggers) -> None:
        self.due = due

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        return [TriggerLineNudge.declared().nudge(trigger=trigger.id) for trigger in self.due.due(event, agent_id)]
