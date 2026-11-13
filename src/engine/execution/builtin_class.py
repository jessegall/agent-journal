from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from engine.enums.execution_source import ExecutionSource
from engine.enums.process_type import ProcessType
from engine.enums.starter_type import StarterType
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_subject import ExecutionSubject


@dataclass(frozen=True)
class BuiltinClass:
    """One row of the built-in class table: the subjects it holds, by source, starter, category, process type and
    window, and the class they take; an empty filter holds every value."""

    execution_class: ExecutionClass
    source: ExecutionSource
    starters: frozenset[StarterType] = frozenset()
    categories: frozenset[CommandCategory] = frozenset()
    process_types: frozenset[ProcessType] = frozenset()
    is_first_window: bool | None = None

    def holds(self, subject: ExecutionSubject) -> bool:
        return (subject.source is self.source
                and (not self.starters or subject.starter.starter_type in self.starters)
                and (not self.categories or subject.category in self.categories)
                and (not self.process_types or subject.process_type in self.process_types)
                and (self.is_first_window is None or subject.is_first_window is self.is_first_window))
