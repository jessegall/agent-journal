import json

from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.module.block_conditions import BlockConditions


class AllConditions(BlockCondition):
    """All of these conditions are true."""

    name = "all-of"

    def __init__(self, *conditions: BlockCondition) -> None:
        super().__init__(json.dumps([[condition.name, condition.text] for condition in conditions]) if conditions else "[]")

    def is_true(self, check: BlockCheck) -> bool:
        conditions = check.container.get(BlockConditions)
        return all(conditions.built(name, text).is_true(check) for name, text in json.loads(self.text))
