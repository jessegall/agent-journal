from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun, START
from core.modules.sequences.lines.sequence_trigger_lines import SEQUENCE_TRIGGER_KEY, TRIGGER_EVENTS
from core.modules.sequences.support.hook_triggered_sequence import HookTriggeredSequence


class SequenceTriggerEffect(EventEffect):
    """A prompt or a finished tool call that matches a sequence's trigger starts that sequence for the agent whose
    hook it is, on top of any run it has, unless that sequence already runs for that agent."""

    key = SEQUENCE_TRIGGER_KEY
    events = TRIGGER_EVENTS

    def __init__(self, triggered: HookTriggeredSequence) -> None:
        self.triggered = triggered

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        sequence_id = self.triggered.sequence_id(event, agent_id) if event is not None else None
        return [MoveSequenceRun(START, sequence_id)] if sequence_id is not None else []
