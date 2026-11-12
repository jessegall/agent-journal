from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.driver.conditions.ran_command import RanCommand
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from core.modules.drivers.models.overview_read import OverviewRead

OVERVIEW_READ_NAME = "overview overview"


class OverviewReadSince(BlockCondition):
    """The agent runs journal overview now, or ran it after the block opened: the run keeps a read row of its own,
    so a hook whose write was lost to a busy database still lets the next hook close the block."""

    name = "overview-read-since"

    def is_true(self, check: BlockCheck) -> bool:
        if RanCommand(self.text).is_true(check):
            return True
        reads = check.container.get(Queries).query(OverviewRead).filter(session_agent_id=check.hook.agent_id, command_name=OVERVIEW_READ_NAME)
        return reads.matching(Greater("created_at", check.opened_at.text)).exists()
