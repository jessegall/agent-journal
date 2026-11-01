from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.enums.wait_type import WaitType


@dataclass(frozen=True)
class OpenWait(Command[Wait]):
    """Opens a wait of the calling agent: on rows named table:id, or a report that it is stuck."""

    type: WaitType
    focus: str
    targets: Sequence[str] = ()
