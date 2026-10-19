from journal.models.command_output import CommandOutput
from journal.repositories.not_found import NotFound
from journal.repositories.scoped_repository import ScopedRepository


class CommandOutputs(ScopedRepository[CommandOutput]):
    model = CommandOutput

    def of_chain(self, chain: str) -> CommandOutput:
        found = self.newest("chain = ?", (chain,))
        if not found:
            raise NotFound(self.table, chain)
        return found[-1]

    def beyond(self, kept: int) -> list[CommandOutput]:
        """The rows older than the newest so many, across every environment: the rolling log keeps no more."""
        return self.selected("id NOT IN (SELECT id FROM command_outputs ORDER BY id DESC LIMIT ?) ORDER BY id", (kept,))
