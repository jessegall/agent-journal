from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.tools.support.tool_card import ToolCard


@dataclass(frozen=True)
class ToolCards:
    """The cards of the Tools page, one per supported tool."""

    cards: Sequence[ToolCard]

    def lines(self) -> Sequence[str]:
        return [line for card in self.cards for line in card.lines()]

    def json(self) -> Mapping[str, object]:
        return {"tools": [card.json() for card in self.cards]}
