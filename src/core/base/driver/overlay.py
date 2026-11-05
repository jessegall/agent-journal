from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.driver_rule import DriverRule
from core.base.driver.open_row import OpenRow


class Overlay:
    """The base of every overlay: a row type whose active rows put its rules before the driver's; an exclusive
    one silences every ordinary rule beneath it, and one that delays notices also silences the rules that only
    tell the agent something."""

    name: ClassVar[str]
    exclusive: ClassVar[bool] = False
    delays_lines: ClassVar[bool] = False
    delays_notices: ClassVar[bool] = False
    drivers: ClassVar[Sequence[str]] = ["*"]
    rules: ClassVar[Sequence[type[DriverRule]]] = []

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        raise NotImplementedError
