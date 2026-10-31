from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.waits.wait import Wait
from core.modules.waits.wait_lifecycle import WaitLifecycle


@dataclass(frozen=True)
class WaitResume(MoveCommand[Wait]):
    move = WaitLifecycle.resume
