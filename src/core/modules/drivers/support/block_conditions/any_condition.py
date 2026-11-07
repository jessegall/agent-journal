import json

from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.module.block_conditions import BlockConditions


class AnyCondition(BlockCondition):
    """One of these conditions is true."""

    name = "any-of"

    def __init__(self, *conditions: BlockCondition) -> None:
        super().__init__(json.dumps([[condition.name, condition.text] for condition in conditions]) if conditions else "[]")

    def is_true(self, check: BlockCheck) -> bool:
        conditions = check.container.get(BlockConditions)
        return any(conditions.built(name, text).is_true(check) for name, text in json.loads(self.text))
