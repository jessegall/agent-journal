from collections.abc import Sequence

from engine.driver.open_row import OpenRow
from engine.driver.overlay import Overlay
from core.modules.overview.support.overview_blocks import OverviewBlocks


class OverviewOverlay(Overlay):
    """An agent that must run journal overview is told nothing else until it has, since the overview shows it
    all; its waiting lines and messages reach it afterwards."""

    name = "overview.waiting"
    exclusive = True
    allows_wakes = True
    delays_lines = True
    delays_notices = True

    def __init__(self, blocks: OverviewBlocks) -> None:
        self.blocks = blocks

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        block = self.blocks.oldest_open(agent_id)
        return [OpenRow("agent_block", block.id, block.creation_timestamp())] if block is not None else []
