from collections.abc import Sequence
from typing import ClassVar

from engine.driver.driver_rule import DriverRule
from engine.driver.open_row import OpenRow


class Overlay:
    """The base of every overlay: a row type whose active rows put its rules before the driver's; an exclusive
    one silences every ordinary rule beneath it, and one that delays notices also silences the rules that only
    tell the agent something. An exclusive one that lets wakes through leaves a rule that wakes a stopped
    agent speaking, since an agent asleep at its prompt cannot do what the overlay waits for. One that pauses the agent also silences the
    rules that yield to a pause, though they speak under any other overlay."""

    name: ClassVar[str]
    exclusive: ClassVar[bool] = False
    allows_wakes: ClassVar[bool] = False
    delays_lines: ClassVar[bool] = False
    delays_notices: ClassVar[bool] = False
    pauses_agent: ClassVar[bool] = False
    drivers: ClassVar[Sequence[str]] = ["*"]
    rules: ClassVar[Sequence[type[DriverRule]]] = []

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        raise NotImplementedError
