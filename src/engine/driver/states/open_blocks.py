from collections.abc import Sequence

from engine.driver.open_row import OpenRow


class OpenBlocks:
    """The blocks still open on an agent for some nudge keys, each as the row that holds it. With no module keeping
    blocks an agent has none."""

    def open_rows(self, agent_id: int, nudge_keys: Sequence[str]) -> Sequence[OpenRow]:
        return ()
