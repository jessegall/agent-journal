from core.base.driver.block_condition import BlockCondition
from core.base.driver.ran_command import RanCommand

CONDITIONS: dict[str, type[RanCommand]] = {RanCommand.name: RanCommand}


class BlockConditions:
    """Builds a stored condition again from its name and text."""

    @staticmethod
    def built(name: str, text: str) -> BlockCondition:
        return CONDITIONS[name](text)
