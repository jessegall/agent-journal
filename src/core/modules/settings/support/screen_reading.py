import hashlib
from dataclasses import dataclass
from core.modules.settings.support.screen_node import ScreenNode


@dataclass(frozen=True)
class ScreenReading:
    """Every node of a screen in the order it is drawn, and a revision that changes when any value or where it
    came from changes."""

    screen: str
    revision: str
    nodes: tuple[ScreenNode, ...]

    @staticmethod
    def revision_of(nodes: tuple[ScreenNode, ...]) -> str:
        return hashlib.sha256(repr([(node.key, node.value, node.source) for node in nodes]).encode()).hexdigest()[:12]
