from collections.abc import Sequence

from engine.container.container import Container
from engine.driver.block_condition import BlockCondition
from engine.driver.conditions.unregistered_condition import UnregisteredCondition
from engine.module.module_finder import ModuleFinder


class BlockConditions:
    """Builds a stored condition again from its name and text, among those the installed modules register, and lets
    each condition read the rows of many blocks at once before they are checked. One whose module has gone is
    taken as true, so nothing stays blocked by a condition no one can check."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.classes = {condition.name: condition for module in finder.modules() for condition in module.block_conditions}

    def names(self) -> set[str]:
        return set(self.classes)

    def prepare(self, conditions: Sequence[tuple[str, str]], container: Container) -> None:
        texts: dict[str, list[str]] = {}
        for name, text in conditions:
            texts.setdefault(name, []).append(text)
        for name, matching_texts in texts.items():
            self.classes.get(name, UnregisteredCondition).prepare(matching_texts, container)

    def built(self, name: str, text: str) -> BlockCondition:
        return self.classes.get(name, UnregisteredCondition).stored(text)
