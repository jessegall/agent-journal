from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.lifecycles.wait_lifecycle import WaitLifecycle


@dataclass(frozen=True)
class ResumeWait(MoveCommand[Wait]):
    move = WaitLifecycle.resume
