from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.helpers.models.helper_steer import HelperSteer


class SteersAnswered(BlockCondition):
    """The helper answered each of these steers."""

    name = "steers-answered"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(Queries).query(HelperSteer).matching(Among("id", tuple(self.numbers))).filter(answer=None).exists()
