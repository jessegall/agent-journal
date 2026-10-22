from journal.models.id_block import IdBlock
from journal.repositories.repository import Repository
from journal.support.actor import Actor
from journal.support.rejection import Rejection

RESERVE_SHARE = 5


class IdBlocks(Repository[IdBlock]):
    """The row numbers this machine holds per table, oldest block first; a used block is removed, and a table wants a new one once fewer numbers are left than a block and a fifth of one."""

    model = IdBlock

    def add(self, table: str, first: int, last: int) -> IdBlock:
        return self.save(IdBlock(row_table=table, first_number=first, last_number=last, next_number=first), Actor.system())

    def next_id(self, table: str) -> int:
        blocks = self.all_matching(row_table=table)
        if not blocks:
            raise Rejection(f"every row number this machine holds for {table} is used: the journal has to reach the team server for more before it can make another")
        block = blocks[0]
        remainder = block.remainder()
        if remainder.spare_count():
            self.save(remainder, Actor.system())
        else:
            self.delete(block, Actor.system())
        return block.next_number

    def is_wanted(self, table: str) -> bool:
        blocks = self.all_matching(row_table=table)
        size = max((block.size() for block in blocks), default=0)
        return not blocks or sum(block.spare_count() for block in blocks) < size + size // RESERVE_SHARE
