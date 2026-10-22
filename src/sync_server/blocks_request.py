from dataclasses import dataclass, field


@dataclass(frozen=True)
class BlocksRequest:
    """The tables a device wants a new block of row numbers for."""

    tables: list = field(default_factory=list)
