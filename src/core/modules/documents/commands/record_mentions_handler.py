from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.documents.commands.record_mentions import RecordMentions
from core.modules.documents.models.link import Link
from core.modules.documents.support.mention_refs import MentionRefs

MENTION_LINK_TYPE = "mentions"


class RecordMentionsHandler(Handler[RecordMentions, int]):
    """Saves a mentions link to each row a text names that exists and is not the row itself; a link already there is
    kept, and none is ever removed."""

    command = RecordMentions

    def __init__(self, registry: Registry, queries: Queries, tables: Tables, repository: Repository) -> None:
        self.registry, self.queries, self.tables, self.repository = registry, queries, tables, repository

    def handle(self, command: RecordMentions, context: Context) -> int:
        targets = [target for cli_name, number in MentionRefs.found(command.text) if (target := self.target(cli_name, number)) and target != command.source]
        new_targets = [target for target in targets if not self.queries.query(Link).filter(source=command.source, target=target, link_type=MENTION_LINK_TYPE).exists()]
        for target in new_targets:
            self.repository.save(Link(creator_id=context.actor.id, source=command.source, target=target, link_type=MENTION_LINK_TYPE), context)
        return len(new_targets)

    def target(self, cli_name: str, number: int) -> str:
        entry = self.registry.models.get(cli_name)
        if entry is None:
            return ""
        model = entry.model.checked_class(Model)
        return f"{self.tables.table(model).name}:{number}" if self.queries.query(model).filter(id=number).exists() else ""
