from dataclasses import dataclass

from engine.driver.open_row import OpenRow
from engine.registry.agent_state_entry import AgentStateEntry
from engine.registry.overlay_entry import OverlayEntry


@dataclass(frozen=True)
class Layer:
    """One open row of an overlay or another agent state in the stack, on one hook."""

    overlay: OverlayEntry | AgentStateEntry
    row: OpenRow
