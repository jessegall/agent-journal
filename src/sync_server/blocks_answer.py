from dataclasses import dataclass

from sync_server.id_block_grant import IdBlockGrant


@dataclass(frozen=True)
class BlocksAnswer:
    """The blocks of row numbers a device asked for, one per table."""

    blocks: tuple[IdBlockGrant, ...]

    @classmethod
    def parsed(cls, blocks: list) -> "BlocksAnswer":
        return cls(tuple(IdBlockGrant(**block) for block in blocks))
