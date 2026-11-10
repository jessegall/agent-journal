from engine.driver.block_condition import BlockCondition
from engine.driver.conditions.unregistered_condition import UnregisteredCondition
from engine.module.module_finder import ModuleFinder


class BlockConditions:
    """Builds a stored condition again from its name and text, among those the installed modules register. One
    whose module has gone is taken as true, so nothing stays blocked by a condition no one can check."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.classes = {condition.name: condition for module in finder.modules() for condition in module.block_conditions}

    def names(self) -> set[str]:
        return set(self.classes)

    def built(self, name: str, text: str) -> BlockCondition:
        return self.classes.get(name, UnregisteredCondition).stored(text)
