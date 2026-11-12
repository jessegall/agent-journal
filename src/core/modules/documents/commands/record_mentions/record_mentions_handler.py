from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.mention_refs import MentionRefs
from core.modules.documents.support.row_refs import RowRefs
from core.modules.documents.support.row_link_writer import RowLinkWriter

MENTIONS_REASON = "the mentions of a text are compared with every mention link it has"


class RecordMentionsHandler(Handler[RecordMentions, int]):
    """Saves a mentions link to each row a text names that exists and is not the row itself; a link already
    there is kept, and none is ever removed."""

    command = RecordMentions

    def __init__(self, registry: Registry, row_refs: RowRefs, queries: Queries, links: RowLinkWriter, numbers: RowNumbers) -> None:
        self.registry, self.row_refs, self.queries, self.links = registry, row_refs, queries, links
        self.numbers = numbers

    def handle(self, command: RecordMentions, context: Context) -> int:
        if self.row_refs.existing(command.source.model, command.source.row_id) is None:
            return 0
        mentioned = dict.fromkeys(ref for text in command.texts for ref in MentionRefs.found(text, self.registry.models))
        references = tuple(ref for ref in (self.row_reference(name, number, context.environment_id) for name, number in mentioned) if ref is not None)
        targets = self.row_refs.existing_many(references)
        stored = self.queries.query(Link).filter(source_model=command.source.model, source_id=command.source.row_id, link_type=LinkType.MENTION).every_row(MENTIONS_REASON)
        existing = {(link.target_model, link.target_id) for link in stored}
        new_targets = [ref for ref in targets if ref != command.source and (ref.model, ref.row_id) not in existing]
        self.links.save_many(tuple(Link(creator_id=context.actor.id, source_model=command.source.model, source_id=command.source.row_id, target_model=ref.model,
                                        target_id=ref.row_id, link_type=LinkType.MENTION) for ref in new_targets), context)
        return len(new_targets)

    def row_reference(self, name: str, number: int, environment_id: int | None) -> tuple[str, int] | None:
        if name != AGENT_MODEL_NAME:
            return name, number
        try:
            return name, self.numbers.row_id(name, number, environment_id)
        except Refusal:
            return None
