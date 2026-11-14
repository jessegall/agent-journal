from types import SimpleNamespace

from engine.driver.open_row import OpenRow
from engine.driver.states.block_state import BlockState
from engine.time.timestamp import Timestamp

OPENED = Timestamp.parsed("2026-11-14T07:00:00+00:00")


class SampleBlocks:
    """Holds one open block for each nudge key and answers the keys it is asked for."""

    def __init__(self, rows: dict[str, OpenRow]) -> None:
        self.rows = rows

    def open_rows(self, agent_id: int, nudge_keys):
        return [self.rows[key] for key in nudge_keys if key in self.rows]


class SampleBlockState(BlockState):
    nudge_keys = ["samples.held"]


BLOCKS = SampleBlocks({"samples.held": OpenRow("block", 1, OPENED), "samples.other": OpenRow("block", 2, OPENED)})


def test_the_state_is_open_for_the_blocks_of_its_nudge_keys_only():
    assert SampleBlockState(BLOCKS).open_rows(SimpleNamespace(agent_id=7)) == [OpenRow("block", 1, OPENED)]


def test_the_state_is_closed_while_the_agent_has_no_block_on_its_keys():
    assert SampleBlockState(SampleBlocks({"samples.other": OpenRow("block", 2, OPENED)})).open_rows(SimpleNamespace(agent_id=7)) == []
