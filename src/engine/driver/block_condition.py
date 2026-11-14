from collections.abc import Sequence
from typing import ClassVar, Self

from engine.container.container import Container
from engine.driver.block_check import BlockCheck


class BlockCondition:
    """What ends a block on an agent. A block stays after its process ends, so a condition is a class stored by its
    name and a text, given as one value or a list of them; each module registers the conditions it offers.
    A condition per subject holds one block for each subject, where others share one block per line."""

    name: ClassVar[str]
    subject_scoped: ClassVar[bool] = False

    def __init__(self, subject: str | int | Sequence[int] = "") -> None:
        self.text = str(subject) if isinstance(subject, (str, int)) else ",".join(str(item) for item in subject)

    @classmethod
    def stored(cls, text: str) -> Self:
        condition = cls()
        condition.text = text
        return condition

    @property
    def numbers(self) -> Sequence[int]:
        return [int(number) for number in self.text.split(",") if number]

    @classmethod
    def prepare(cls, texts: Sequence[str], container: Container) -> None:
        return None

    # Whether the row the condition waits on exists; a block on a missing one could never close.
    def has_target(self, container: Container) -> bool:
        return True

    def is_true(self, check: BlockCheck) -> bool:
        raise NotImplementedError
