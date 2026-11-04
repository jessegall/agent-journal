from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.aliases.queries.alias_query import AliasQuery


class ReaderAliasGuard(Guard):
    name = "aliases.reader-in-use"
    event = "reader.delete"

    def __init__(self, aliases: AliasQuery) -> None:
        self.aliases = aliases

    def check(self, change: Change[Model]) -> None:
        aliases = self.aliases.filter(reader_id=change.row.id).page(1, 1).rows
        if aliases:
            raise Refusal(f"reader is referenced by alias {aliases[0].name}", "remove or edit the alias first")
