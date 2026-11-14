import re
from collections.abc import Sequence
from dataclasses import replace

from engine.enums.execution_lane import ExecutionLane
from engine.execution.classes.builtin_classes import BUILTIN_CLASSES
from engine.execution.errors.execution_class_cost_error import ExecutionClassCostError
from engine.execution.classes.execution_class import ExecutionClass
from engine.execution.execution_subject import ExecutionSubject
from engine.execution.classes.person_classes import PersonClasses

LANE_LENGTHS = {ExecutionLane.INSTANT: 0, ExecutionLane.SHORT: 1, ExecutionLane.LONG: 2}


class ExecutionClasses:
    """Picks the class of what is about to run: a class the person added wins, by its plugin and its line pattern,
    over the built-in table, whose first row that holds the subject gives the class."""

    def __init__(self, person: PersonClasses) -> None:
        self.person = person

    def match(self, subject: ExecutionSubject) -> ExecutionClass:
        own = next((execution_class for execution_class in self.person.classes() if self.is_person_match(execution_class, subject)), None)
        if own is not None:
            return own
        return next(row.execution_class for row in BUILTIN_CLASSES if row.holds(subject))

    # the class a stored run names, the person's before the built-in one; none for a name nobody declares any more
    def named(self, name: str) -> ExecutionClass | None:
        every_class = (*self.person.classes(), *(row.execution_class for row in BUILTIN_CLASSES))
        return next((execution_class for execution_class in every_class if execution_class.name == name), None)

    # a line of several parts waits in the longest lane of its parts and takes the highest cost of them, not their sum
    def for_line(self, parts: Sequence[ExecutionSubject]) -> ExecutionClass:
        classes = [self.match(part) for part in parts]
        longest = max(classes, key=lambda execution_class: LANE_LENGTHS[execution_class.lane])
        return replace(longest, slot_cost=max(execution_class.slot_cost for execution_class in classes))

    @staticmethod
    def validate(execution_class: ExecutionClass, lane_capacity: int) -> None:
        if execution_class.slot_cost > lane_capacity:
            raise ExecutionClassCostError(execution_class, lane_capacity)

    # a person's class names a plugin, a line pattern or both; a plugin's run never takes a class written for the journal
    @staticmethod
    def is_person_match(execution_class: ExecutionClass, subject: ExecutionSubject) -> bool:
        if execution_class.plugin and execution_class.plugin != subject.plugin_name:
            return False
        if execution_class.line_pattern and not re.search(execution_class.line_pattern, subject.line):
            return False
        return bool(execution_class.plugin or execution_class.line_pattern)
