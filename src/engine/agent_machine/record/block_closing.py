from dataclasses import dataclass

from engine.enums.block_end import BlockEnd


@dataclass(frozen=True)
class BlockClosing:
    """A hold row a step closes: the end it takes, what closed it and the evidence."""

    block_id: int
    block_end: BlockEnd
    closer: str
    closing_evidence: str
