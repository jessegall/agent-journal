from typing import Protocol

from engine.execution.execution_class import ExecutionClass


class PersonClasses(Protocol):
    """The classes the person added, which the class store of phase 6 keeps; until then there are none."""

    def classes(self) -> tuple[ExecutionClass, ...]: ...
