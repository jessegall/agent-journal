from dataclasses import dataclass

from engine.driver.open_row import OpenRow
from engine.registry.overlay_entry import OverlayEntry


@dataclass(frozen=True)
class Layer:
    """One active row of an overlay on one hook."""

    overlay: OverlayEntry
    row: OpenRow
