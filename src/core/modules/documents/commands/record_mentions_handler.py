from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.documents.commands.record_mentions import RecordMentions
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.mention_refs import MentionRefs
from core.modules.documents.support.row_refs import RowRefs


class RecordMentionsHandler(Handler[RecordMentions, int]):
    """Saves a mentions link to each row a text names that exists and is not the row itself; a link already there is
    kept, and none is ever removed."""

    command = RecordMentions

    def __init__(self, registry: Registry, row_refs: RowRefs, queries: Queries, repository: Repository) -> None:
        self.registry, self.row_refs, self.queries, self.repository = registry, row_refs, queries, repository

    def handle(self, command: RecordMentions, context: Context) -> int:
        existing_refs = [self.row_refs.existing(name, number) for name, number in MentionRefs.found(command.text, self.registry.models)]
        targets = [ref for ref in existing_refs if ref is not None and ref != command.source]
        new_targets = [ref for ref in targets if not self.queries.query(Link).filter(source_model=command.source.model, source_id=command.source.row_id, target_model=ref.model,
                                                                                    target_id=ref.row_id, link_type=LinkType.MENTION).exists()]
        for ref in new_targets:
            self.repository.save(Link(creator_id=context.actor.id, source_model=command.source.model, source_id=command.source.row_id, target_model=ref.model,
                                      target_id=ref.row_id, link_type=LinkType.MENTION), context)
        return len(new_targets)
