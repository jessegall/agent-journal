from collections.abc import Sequence

from core.base.container import Container
from core.base.module.module_finder import ModuleFinder


class StepConditions:
    """The conditions a sequence step can name, among those the installed modules register. One whose module has
    gone counts as met, so no step stays held by a condition no one can check."""

    def __init__(self, finder: ModuleFinder, container: Container) -> None:
        self.classes = {condition.name: condition for module in finder.modules() for condition in module.step_conditions}
        self.container = container

    def names(self) -> set[str]:
        return set(self.classes)

    def problems(self, names: Sequence[str], subject_id: int) -> tuple[str, ...]:
        answers = (self.container.get(self.classes[name]).problem(subject_id) for name in names if name in self.classes)
        return tuple(answer for answer in answers if answer is not None)
