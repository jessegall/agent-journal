from collections.abc import Sequence
from typing import TYPE_CHECKING, ClassVar

if TYPE_CHECKING:
    from core.base.seed.demo import Demo


class Seeder:
    """What one module puts in a demo journal: rows made only through the module's own commands, run as a
    person or an agent, in the order of what the module depends on and of the seeders it names to follow."""

    follows: ClassVar[Sequence[str]] = ()

    def seed(self, demo: "Demo") -> None:
        raise NotImplementedError(f"{type(self).__name__} seeds nothing")
