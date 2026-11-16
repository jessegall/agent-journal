import re
from collections.abc import Sequence
from dataclasses import replace

from engine.enums.execution_length import ExecutionLength
from engine.execution.classes.builtin_classes import BUILTIN_CLASSES
from engine.execution.errors.execution_class_cost_error import ExecutionClassCostError
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.execution_subject import ExecutionSubject
from engine.execution.classes.person_classes import PersonClasses

POOL_LENGTHS = {ExecutionLength.INSTANT: 0, ExecutionLength.SHORT: 1, ExecutionLength.LONG: 2}


class ExecutionClasses:
    """Picks the class of what is about to run: a class the person added wins, by its plugin and its line pattern,
    over the built-in table, whose first row that holds the subject gives the class."""

    def __init__(self, person: PersonClasses) -> None:
        self.person = person

    def match(self, subject: ExecutionSubject) -> ExecutionClass:
        personal = next((execution_class for execution_class in self.person.classes() if self.is_person_match(execution_class, subject)), None)
        if personal is not None:
            return personal
        return next(row.execution_class for row in BUILTIN_CLASSES if row.applies_to(subject))

    # the class a stored run names, the person's before the built-in one; none for a name nobody declares any more
    def named(self, name: str) -> ExecutionClass | None:
        all_classes = (*self.person.classes(), *(row.execution_class for row in BUILTIN_CLASSES))
        return next((execution_class for execution_class in all_classes if execution_class.name == name), None)

    # a line of several parts waits in the longest lane of its parts and takes the highest cost of them, not their sum
    def line_class(self, parts: Sequence[ExecutionSubject]) -> ExecutionClass:
        classes = [self.match(part) for part in parts]
        longest = max(classes, key=lambda execution_class: POOL_LENGTHS[execution_class.pool])
        return replace(longest, slot_cost=max(execution_class.slot_cost for execution_class in classes))

    @staticmethod
    def validate(execution_class: ExecutionClass, pool_capacity: int) -> None:
        if execution_class.slot_cost > pool_capacity:
            raise ExecutionClassCostError(execution_class, pool_capacity)

    # a person's class names a plugin, a line pattern or both; a plugin's run never takes a class written for the journal
    @staticmethod
    def is_person_match(execution_class: ExecutionClass, subject: ExecutionSubject) -> bool:
        if execution_class.plugin and execution_class.plugin != subject.plugin_name:
            return False
        if execution_class.line_pattern and not re.search(execution_class.line_pattern, subject.line):
            return False
        return bool(execution_class.plugin or execution_class.line_pattern)
