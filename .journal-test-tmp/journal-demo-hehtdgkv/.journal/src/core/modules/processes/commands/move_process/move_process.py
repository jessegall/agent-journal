from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class MoveProcess(MoveCommand[Process]):
    move = ProcessLifecycle.background
