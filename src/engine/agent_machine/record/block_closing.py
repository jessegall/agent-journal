from dataclasses import dataclass

from engine.enums.hold_end import HoldEnd


@dataclass(frozen=True)
class BlockClosing:
    """A hold row a step closes: the end it takes, what closed it and the evidence."""

    block_id: int
    hold_end: HoldEnd
    closer: str
    closing_evidence: str
