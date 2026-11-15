from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.sequences.nudges.sequence_started_nudge import SequenceStartedNudge
from core.modules.sequences.support.hook_triggered_sequence import HookTriggeredSequence

SEQUENCE_TRIGGER_KEY = "sequences.triggers"
TRIGGER_EVENTS = [HookEventName.PROMPT, HookEventName.POST_TOOL_USE]


class SequenceTriggerLines(EventLineSource):
    """The agent whose prompt or finished tool call starts a sequence is told it started."""

    key = SEQUENCE_TRIGGER_KEY
    events = TRIGGER_EVENTS

    def __init__(self, triggered: HookTriggeredSequence) -> None:
        self.triggered = triggered

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        sequence_id = self.triggered.sequence_id(event, agent_id) if event is not None else None
        return [SequenceStartedNudge.declared().nudge(sequence=sequence_id)] if sequence_id is not None else []
