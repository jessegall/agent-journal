from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.aliases.queries.alias_query import AliasQuery
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.modules.processes.models.reader import Reader


class ReaderAliasGuard(Guard[Deleted[Reader]]):
    name = "aliases.reader-in-use"

    def __init__(self, aliases: AliasQuery) -> None:
        self.aliases = aliases

    def check(self, event: Deleted[Reader], context: Context) -> None:
        alias = self.aliases.filter(reader_id=event.row.id).first()
        if alias is not None:
            raise Refusal(f"reader is referenced by alias {alias.name}", "remove or edit the alias first")
