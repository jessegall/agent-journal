from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.aliases.queries.alias_query import AliasQuery
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.modules.processes.models.reader import Reader


class ReaderAliasGuard(Guard[Deleted[Reader]]):
    name = "aliases.reader-in-use"

    def __init__(self, aliases: AliasQuery) -> None:
        self.aliases = aliases

    def check(self, event: Deleted[Reader], context: Context) -> None:
        aliases = self.aliases.filter(reader_id=event.row.id).page(1, 1).rows
        if aliases:
            raise Refusal(f"reader is referenced by alias {aliases[0].name}", "remove or edit the alias first")
