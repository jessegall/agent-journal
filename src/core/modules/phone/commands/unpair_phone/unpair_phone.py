from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.phone.models.lifecycles.phone_lifecycle import PhoneLifecycle
from core.modules.phone.models.phone import Phone


@dataclass(frozen=True)
class UnpairPhone(MoveCommand[Phone]):
    move = PhoneLifecycle.unpair
