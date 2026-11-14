from abc import ABC, abstractmethod

from engine.execution.classes.execution_class import ExecutionClass


class PersonClasses(ABC):
    """The classes the person added or changed, which the processes module keeps in its class store."""

    @abstractmethod
    def classes(self) -> tuple[ExecutionClass, ...]: ...
