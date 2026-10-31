from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.waits.wait import Wait
from core.modules.waits.wait_type import WaitType


@dataclass(frozen=True)
class WaitOpen(Command[Wait]):
    """Opens a wait of the calling agent: on rows named table:id, or a report that it is stuck."""

    type: WaitType
    focus: str
    targets: Sequence[str] = ()
