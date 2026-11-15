from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.triggers.agent_messages.trigger_line_message import TriggerLineMessage
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

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return [TriggerLineMessage.declared().agent_message(trigger=trigger.id) for trigger in self.due.due(event, agent_id)]
