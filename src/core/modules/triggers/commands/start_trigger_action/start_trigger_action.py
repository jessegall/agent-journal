from dataclasses import dataclass
from core.base.command.command import Command
from core.modules.processes.models.process import Process
from core.modules.triggers.models.support.trigger_extra_action import TriggerExtraAction


@dataclass(frozen=True)
class StartTriggerAction(Command[Process]):
    trigger_id: int
    agent_id: int
    action: TriggerExtraAction
