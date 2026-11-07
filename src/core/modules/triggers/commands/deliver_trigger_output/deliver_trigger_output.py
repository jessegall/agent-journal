from dataclasses import dataclass
from core.base.command.command import Command
from core.modules.triggers.models.trigger_action_run import TriggerActionRun


@dataclass(frozen=True)
class DeliverTriggerOutput(Command[TriggerActionRun]):
    action_run_id: int
