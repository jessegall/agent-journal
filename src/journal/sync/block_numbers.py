from journal.events.listener import Listener
from journal.events.models.number_request import NumberRequest
from journal.repositories.id_blocks import IdBlocks
from journal.sync.team_account import TeamAccount


class BlockNumbers(Listener[NumberRequest]):
    """A new row of a shared model takes its number from this machine's blocks once the journal has joined a team, so no two machines give one number; otherwise SQLite numbers it."""

    def __init__(self, blocks: IdBlocks, account: TeamAccount) -> None:
        self.blocks, self.account = blocks, account

    def handle(self, event: NumberRequest) -> int:
        if not event.model.shared or not self.account.is_joined():
            return 0
        return self.blocks.next_id(event.model.table())
